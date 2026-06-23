const axios = require('axios');

/**
 * Judge0 language IDs
 * https://judge0-ce.p.rapidapi.com/languages
 */
const LANGUAGE_MAP = {
  'c++':        54,
  'cpp':        54,
  'c':          50,
  'java':       62,
  'python':     71,
  'javascript': 63,
  'js':         63,
};

const getLanguageById = (lang) => {
  if (!lang) return null;
  const id = LANGUAGE_MAP[lang.toLowerCase().trim()];
  if (!id) console.warn(`[Judge] Unknown language: "${lang}"`);
  return id || null;
};


const encode = (str) => Buffer.from(str || '').toString('base64');

/**
 * Decode a base64 string returned by Judge0.
 * Returns empty string safely when value is null/undefined.
 */
const decode = (val) => {
  if (!val) return '';
  try {
    return Buffer.from(val, 'base64').toString('utf8');
  } catch {
    return String(val);
  }
};

// ─── Judge0 headers ──────────────────────────────────────────────────────────

const getHeaders = () => ({
  'x-rapidapi-key':  process.env.JUDGE0_KEY,
  'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
  'Content-Type':    'application/json',
});

// ─── Submit batch ─────────────────────────────────────────────────────────────

const submitBatch = async (submissions) => {
  const encoded = submissions.map((s) => ({
    source_code:     encode(s.source_code),
    language_id:     s.language_id,
    stdin:           encode(s.stdin || ''),
    expected_output: encode(s.expected_output || ''),
  }));

  console.log(`[Judge] Submitting ${encoded.length} testcase(s) (base64_encoded=true)`);

  try {
    const response = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions/batch',
      { submissions: encoded },
      {
        params:  { base64_encoded: 'true' },
        headers: getHeaders(),
        timeout: 15000,
      }
    );
    console.log('[Judge] submitBatch response:', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    const detail   = error?.response?.data || error.message;
    const detailStr = JSON.stringify(detail).toLowerCase();
    console.error('[Judge] submitBatch error:', detail);
    // Detect RapidAPI / Judge0 quota exceeded (HTTP 429 or body contains quota keywords)
    if (
      error?.response?.status === 429 ||
      detailStr.includes('quota') ||
      detailStr.includes('exceeded') ||
      detailStr.includes('rate limit')
    ) {
      const quotaErr = new Error('Judge server quota exceeded. Please try again later.');
      quotaErr.isQuotaError = true;
      throw quotaErr;
    }
    throw new Error(`Judge0 batch submission failed: ${JSON.stringify(detail)}`);
  }
};

// ─── Poll batch ───────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Poll Judge0 until all submissions reach a terminal status (status_id > 2).
 * status_id 1 = In Queue, 2 = Processing, 3+ = terminal.
 * Responses are base64-decoded before returning.
 */
const submitToken = async (resultTokens, maxAttempts = 20) => {
  if (!resultTokens || resultTokens.length === 0) {
    throw new Error('[Judge] No tokens to poll');
  }

  console.log(`[Judge] Polling ${resultTokens.length} token(s): ${resultTokens.join(',')}`);

  let attempt = 0;
  let delay   = 1500; // start at 1.5s

  while (attempt < maxAttempts) {
    attempt++;
    await sleep(delay);
    delay = Math.min(delay + 500, 4000); // back-off up to 4s

    try {
      const response = await axios.get(
        'https://judge0-ce.p.rapidapi.com/submissions/batch',
        {
          params: {
            tokens:         resultTokens.join(','),
            base64_encoded: 'true',
            fields:         '*',
          },
          headers: getHeaders(),
          timeout: 15000,
        }
      );

      const submissions = response.data?.submissions || [];
      console.log(
        `[Judge] Poll ${attempt}/${maxAttempts} — statuses: [${submissions.map((s) => s.status?.id ?? s.status_id).join(', ')}]`
      );

      // Check if all are terminal (status_id > 2)
      const allDone = submissions.every((s) => {
        const id = s.status?.id ?? s.status_id ?? -1;
        return id > 2;
      });

      if (allDone) {
        // Decode all base64 fields before returning
        return submissions.map((s) => ({
          ...s,
          stdout:         decode(s.stdout),
          stderr:         decode(s.stderr),
          compile_output: decode(s.compile_output),
          message:        decode(s.message),
          // normalise status_id to a flat integer
          status_id:      s.status?.id ?? s.status_id ?? -1,
        }));
      }

    } catch (error) {
      const detail = error?.response?.data || error.message;
      console.error(`[Judge] Poll attempt ${attempt} error:`, detail);
    }
  }

  throw new Error(`[Judge] Timed out waiting for Judge0 results after ${maxAttempts} attempts`);
};


const normalizeOutput = (raw = '') =>
  (raw || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();

module.exports = { getLanguageById, submitBatch, submitToken, normalizeOutput, decode };
