const Problem    = require('../models/problem');
const Submission = require('../models/submission');
const { getLanguageById, submitBatch, submitToken, normalizeOutput } = require('../utils/problemUtility');
const { getOrCreatePOTD } = require('./potd');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Map Judge0 terminal status_id → short slug used in API responses.
 */
const STATUS_SLUG = {
  3:  'accepted',
  4:  'wrong_answer',
  5:  'tle',
  6:  'compilation_error',
  7:  'runtime_error',
  8:  'runtime_error',
  9:  'runtime_error',
  10: 'runtime_error',
  11: 'runtime_error',
  12: 'runtime_error',
};

/**
 * Judge0 status_id → human-readable verdict (kept for display labels).
 * NOTE: Judge0 may return status as { id, description } object OR a flat
 *       status_id integer depending on the 'fields' param. We handle both.
 */
const getStatusId = (tc) => {
  // Flat integer (batch endpoint)
  if (typeof tc.status_id === 'number') return tc.status_id;
  // Nested object { id, description }
  if (tc.status && typeof tc.status.id === 'number') return tc.status.id;
  return -1; // unknown
};

const getVerdict = (statusId) => {
  switch (statusId) {
    case 3:  return 'Accepted';
    case 4:  return 'Wrong Answer';
    case 5:  return 'Time Limit Exceeded';
    case 6:  return 'Compilation Error';
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12: return 'Runtime Error';
    default: return 'Unknown Error';
  }
};

// Safely normalise output for display (does NOT affect comparison —
// normalizeOutput is used separately for comparisons).
const safeOutput = (raw) => {
  if (!raw) return '';
  return normalizeOutput(String(raw));
};

/* ─── Submit (judge against ALL hidden testcases) ─────────────────────────── */
const submitCode = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'User not authenticated' });

    const userId    = req.user._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    console.log('[submit] START — problemId:', problemId, 'language:', language, 'userId:', userId);

    if (!code || !problemId || !language) {
      return res.status(400).json({ error: 'Missing required fields: code, language' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const langKey    = language.toLowerCase().trim();
    const languageId = getLanguageById(langKey);
    if (!languageId) return res.status(400).json({ error: `Unsupported language: "${language}". Supported: cpp, java, python, javascript` });

    // ── Diagnostic logging (confirms correct solution is in DB for this problem) ─
    console.log(`[submit] problem.title: "${problem.title}"`);
    const refSol = problem.referenceSolution?.find(s => s.language === langKey);
    console.log(`[submit] referenceSolution[${langKey}] preview: ${(refSol?.completeCode || '(none)').slice(0, 80).replace(/\n/g, ' ')}...`);
    console.log(`[submit] hiddenTestCases: ${problem.hiddenTestCases?.length || 0}, visibleTestCases: ${problem.visibleTestCases?.length || 0}`);

    // Use visible testcases as fallback if no hidden testcases exist
    const testCases = (problem.hiddenTestCases && problem.hiddenTestCases.length > 0)
      ? problem.hiddenTestCases
      : problem.visibleTestCases;

    if (!testCases || testCases.length === 0) {
      return res.status(400).json({ error: 'Problem has no testcases configured' });
    }

    console.log('[submit] Testcase count:', testCases.length, '| Language ID:', languageId);

    // Create pending submission record first
    const submission = await Submission.create({
      userId,
      problemId,
      code,
      language: langKey,
      status: 'pending',
      testCasesTotal: testCases.length
    });

    // Build Judge0 batch payload
    const batchPayload = testCases.map((tc) => ({
      source_code:     code,
      language_id:     languageId,
      stdin:           tc.input   || '',
      expected_output: safeOutput(tc.output),
    }));

    console.log('[submit] Sending batch to Judge0, count:', batchPayload.length);
    const tokenObjs = await submitBatch(batchPayload);

    if (!tokenObjs || !Array.isArray(tokenObjs) || tokenObjs.length === 0) {
      throw new Error('Judge0 returned empty token list');
    }

    const tokens    = tokenObjs.map((t) => t.token).filter(Boolean);
    console.log('[submit] Got tokens:', tokens.length, '— polling now...');

    const testResult = await submitToken(tokens);
    console.log('[submit] Poll complete, result count:', testResult.length);

    // ─── Aggregate results ──────────────────────────────────────────────────
    let passed       = 0;
    let runtime      = 0;
    let memory       = 0;
    let status       = 'accepted';
    let errorMessage = null;
    let firstFailure = null;

    for (let i = 0; i < testResult.length; i++) {
      const tc       = testResult[i];
      const statusId = getStatusId(tc);
      const stdout   = safeOutput(tc.stdout);
      const stderr   = safeOutput(tc.stderr || tc.compile_output);

      console.log(`[submit] TC[${i}] status_id=${statusId} stdout="${stdout.slice(0,80)}" stderr="${stderr.slice(0,80)}"`);

      if (statusId === 3) {
        passed++;
        runtime += parseFloat(tc.time || 0);
        memory   = Math.max(memory, tc.memory || 0);
      } else {
        if (!firstFailure) {
          firstFailure = {
            verdict:        getVerdict(statusId),
            stdin:          testCases[i]?.input || '',
            expectedOutput: safeOutput(testCases[i]?.output),
            yourOutput:     stdout,
            stderr,
          };
        }
        if (statusId === 6)                 status = 'ce';
        else if (statusId === 5)            status = 'tle';
        else if (status === 'accepted')     status = 'wrong';
        errorMessage = stderr || errorMessage;
      }
    }

    // Persist result
    submission.status          = status;
    submission.testCasesPassed = passed;
    submission.errorMessage    = errorMessage || '';
    submission.runtime         = Math.round(runtime * 1000);
    submission.memory          = memory;
    await submission.save();

    // Award problem-solved badge on full acceptance
    if (status === 'accepted' && !req.user.problemSolved?.includes(String(problemId))) {
      req.user.problemSolved = req.user.problemSolved || [];
      req.user.problemSolved.push(problemId);
      await req.user.save();
    }

    // ── POTD auto-reward ────────────────────────────────────────────────────
    let potdCoinAwarded = false;
    if (status === 'accepted') {
      try {
        const potd = await getOrCreatePOTD();
        const isPotd = String(potd.problemId?._id || potd.problemId) === String(problemId);
        const alreadyRewarded = potd.rewardedUsers.some((id) => String(id) === String(req.user._id));

        if (isPotd && !alreadyRewarded) {
          const today = new Date().toISOString().slice(0, 10);
          const ProblemOfDay = require('../models/problemOfDay');
          await Promise.all([
            ProblemOfDay.updateOne({ _id: potd._id }, { $addToSet: { rewardedUsers: req.user._id } }),
            req.user.constructor.findByIdAndUpdate(req.user._id, {
              $inc: { orbitCoins: 10, points: 10 },
              $push: { dailySolvedProblems: { problemId, date: today, solvedAt: new Date() } }
            })
          ]);
          potdCoinAwarded = true;
          console.log(`[POTD] Awarded 10 coins to user ${req.user._id} for solving POTD`);
        }
      } catch (potdErr) {
        console.error('[POTD] reward check failed (non-critical):', potdErr.message);
      }
    }

    console.log(`[submit] DONE — status: ${status}, passed: ${passed}/${testCases.length}`);

    return res.status(201).json({
      accepted:        status === 'accepted',
      status,
      totalTestCases:  testCases.length,
      passedTestCases: passed,
      runtime:         submission.runtime,
      memory,
      error:           errorMessage,
      firstFailure,
      potdCoinAwarded,
    });

  } catch (err) {
    console.error('[submitCode] CRASH:', err.message);
    // Clean quota error — never expose raw Judge0 / RapidAPI internals
    if (err.isQuotaError) {
      return res.status(429).json({
        success: false,
        type:    'JUDGE_QUOTA_EXCEEDED',
        message: 'Judge server quota exceeded. Please try again later.',
      });
    }
    console.error(err.stack);
    return res.status(500).json({
      error: 'Internal server error. Please try again.',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
};

/* ─── Run (judge against VISIBLE testcases only) ──────────────────────────── */
const runCode = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'User not authenticated' });

    const problemId = req.params.id;
    const { code, language } = req.body;

    console.log('[run] START — problemId:', problemId, 'language:', language);

    if (!code || !problemId || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const langKey    = language.toLowerCase().trim();
    const languageId = getLanguageById(langKey);
    if (!languageId) return res.status(400).json({ error: `Unsupported language: "${language}"` });

    if (!problem.visibleTestCases || problem.visibleTestCases.length === 0) {
      return res.status(400).json({ error: 'Problem has no visible testcases' });
    }

    const batchPayload = problem.visibleTestCases.map((tc) => ({
      source_code:     code,
      language_id:     languageId,
      stdin:           tc.input   || '',
      expected_output: safeOutput(tc.output),
    }));

    console.log('[run] Sending batch:', batchPayload.length, 'cases');
    const tokenObjs = await submitBatch(batchPayload);

    if (!tokenObjs || !Array.isArray(tokenObjs) || tokenObjs.length === 0) {
      throw new Error('Judge0 returned empty token list');
    }

    const tokens = tokenObjs.map((t) => t.token).filter(Boolean);
    console.log('[run] Got tokens:', tokens.length, '— polling...');

    const testResult = await submitToken(tokens);
    console.log('[run] Poll done:', testResult.length, 'results');

    let passedCount  = 0;
    let runtime      = 0;
    let memory       = 0;
    let topVerdict   = 'accepted'; // will be downgraded on first non-Accepted
    let errorMessage = null;

    const enrichedCases = testResult.map((tc, i) => {
      const statusId      = getStatusId(tc);
      const rawStdout     = tc.stdout   || '';
      const rawStderr     = tc.stderr   || '';
      const rawCompile    = tc.compile_output || '';

      // Normalise actual output and expected output for comparison
      const actualNorm   = normalizeOutput(rawStdout);
      const expectedNorm = normalizeOutput(
        String(problem.visibleTestCases[i]?.output || '')
      );

      // A testcase passes if Judge0 says Accepted AND our own
      // normalised comparison agrees (defends against Judge0 WA
      // when expected_output encoding is off).
      const outputMatch = actualNorm === expectedNorm;

      // Determine per-case verdict:
      //  - CE / TLE / RE take priority from Judge0 status
      //  - Otherwise we trust our own comparison
      let casePassed = false;
      let caseSlug   = STATUS_SLUG[statusId] || 'runtime_error';

      if (statusId === 6) {
        caseSlug = 'compilation_error';
      } else if (statusId === 5) {
        caseSlug = 'tle';
      } else if (statusId >= 7 && statusId <= 12) {
        caseSlug = 'runtime_error';
      } else {
        // status 3 or 4 — use our own comparison
        casePassed = outputMatch;
        caseSlug   = outputMatch ? 'accepted' : 'wrong_answer';
      }

      if (casePassed) {
        passedCount++;
        runtime += parseFloat(tc.time || 0);
        memory   = Math.max(memory, tc.memory || 0);
      } else {
        errorMessage = rawStderr || rawCompile || errorMessage;
        // Downgrade overall verdict (worst case wins)
        if (topVerdict === 'accepted') topVerdict = caseSlug;
      }

      return {
        verdict:        getVerdict(statusId === 3 && !casePassed ? 4 : statusId),
        statusId,
        passed:         casePassed,
        yourOutput:     rawStdout,
        expectedOutput: problem.visibleTestCases[i]?.output ?? '',
        input:          problem.visibleTestCases[i]?.input  || '',
        stderr:         rawStderr,
        compileOutput:  rawCompile,
        time:           tc.time,
        memory:         tc.memory,
      };
    });

    const allPassed = passedCount === testResult.length;
    if (allPassed) topVerdict = 'accepted';

    return res.status(200).json({
      success:   allPassed,
      verdict:   topVerdict,
      testCases: enrichedCases,
      runtime:   Math.round(runtime * 1000),
      memory,
      error:     errorMessage,
    });

  } catch (err) {
    console.error('[runCode] CRASH:', err.message);
    // Clean quota error — never expose raw Judge0 / RapidAPI internals
    if (err.isQuotaError) {
      return res.status(429).json({
        success: false,
        type:    'JUDGE_QUOTA_EXCEEDED',
        message: 'Judge server quota exceeded. Please try again later.',
      });
    }
    console.error(err.stack);
    return res.status(500).json({
      error: 'Internal server error. Please try again.',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
};

module.exports = { submitCode, runCode };