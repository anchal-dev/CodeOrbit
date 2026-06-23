const OpenAI = require('openai');
const InterviewTrack = require('../models/InterviewTrack');
const InterviewQuestion = require('../models/InterviewQuestion');
const InterviewProgress = require('../models/InterviewProgress');
const MockInterview = require('../models/MockInterview');
const InterviewExperience = require('../models/InterviewExperience');
const User = require('../models/user');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENAI_API_KEY ? undefined : "https://openrouter.ai/api/v1",
});

const getModel = () => process.env.OPENAI_API_KEY ? "gpt-3.5-turbo" : "openai/gpt-3.5-turbo";

// Helper: Ensure a progress document exists for user
async function getOrCreateProgress(userId) {
  let progress = await InterviewProgress.findOne({ userId });
  if (!progress) {
    progress = await InterviewProgress.create({ userId, solvedQuestions: [], sheetProgress: [] });
  }
  return progress;
}

// ─── GET /interview/tracks ──────────────────────────────────────────────────
exports.getTracks = async (req, res) => {
  try {
    const userId = req.user?._id;
    const tracks = await InterviewTrack.find({});
    const progress = userId ? await getOrCreateProgress(userId) : null;

    const data = await Promise.all(tracks.map(async (t) => {
      // Find all questions in this track
      const questions = await InterviewQuestion.find({ trackId: t.trackName }).select('_id topic difficulty title');
      
      // Group questions by topic
      const topicsMap = {};
      questions.forEach(q => {
        if (!topicsMap[q.topic]) {
          topicsMap[q.topic] = { name: q.topic, total: 0, solved: 0, questions: [] };
        }
        topicsMap[q.topic].total += 1;
        const isSolved = progress && progress.solvedQuestions.some(id => id.equals(q._id));
        if (isSolved) topicsMap[q.topic].solved += 1;
        topicsMap[q.topic].questions.push({
          _id: q._id,
          title: q.title,
          difficulty: q.difficulty,
          solved: !!isSolved
        });
      });

      const topics = Object.values(topicsMap);
      const totalQuestions = questions.length;
      const totalSolved = progress
        ? questions.filter(q => progress.solvedQuestions.some(id => id.equals(q._id))).length
        : 0;

      return {
        trackName: t.trackName,
        title: t.title,
        description: t.description,
        totalQuestions,
        totalSolved,
        difficulty: t.difficulty,
        topics
      };
    }));

    res.json({ tracks: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /interview/company/:name ─────────────────────────────────────────────
exports.getCompanyData = async (req, res) => {
  try {
    const { name } = req.params;
    const userId = req.user?._id;
    const progress = userId ? await getOrCreateProgress(userId) : null;

    // Search case-insensitively in companyTags
    const questions = await InterviewQuestion.find({
      companyTags: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    const experiences = await InterviewExperience.find({
      company: { $regex: new RegExp(`^${name}$`, 'i') }
    }).populate('userId', 'firstName lastName avatar');

    const mappedQuestions = questions.map(q => ({
      _id: q._id,
      title: q.title,
      difficulty: q.difficulty,
      topic: q.topic,
      trackId: q.trackId,
      questionText: q.questionText,
      sampleAnswer: q.sampleAnswer,
      tips: q.tips,
      solved: progress ? progress.solvedQuestions.some(id => id.equals(q._id)) : false
    }));

    res.json({
      companyName: name,
      questions: mappedQuestions,
      experiences
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /interview/track/:trackName ─────────────────────────────────────────
exports.getTrackData = async (req, res) => {
  try {
    const { trackName } = req.params;
    const userId = req.user?._id;
    const progress = userId ? await getOrCreateProgress(userId) : null;

    const track = await InterviewTrack.findOne({ trackName });
    if (!track) {
      return res.status(404).json({ error: 'Track not found.' });
    }

    const questions = await InterviewQuestion.find({ trackId: trackName });

    const mappedQuestions = questions.map(q => ({
      _id: q._id,
      title: q.title,
      difficulty: q.difficulty,
      topic: q.topic,
      trackId: q.trackId,
      questionText: q.questionText,
      sampleAnswer: q.sampleAnswer,
      tips: q.tips,
      solved: progress ? progress.solvedQuestions.some(id => id.equals(q._id)) : false
    }));

    res.json({
      track,
      questions: mappedQuestions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /interview/experiences ──────────────────────────────────────────────
exports.getExperiences = async (req, res) => {
  try {
    const experiences = await InterviewExperience.find({})
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 });
    res.json({ experiences });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── POST /interview/experience ──────────────────────────────────────────────
exports.postExperience = async (req, res) => {
  try {
    const userId = req.user._id;
    const { company, role, year, questionsAsked, tips, difficulty, verdict } = req.body;

    if (!company || !role || !year || !questionsAsked || !questionsAsked.length) {
      return res.status(400).json({ error: 'Missing required experience fields.' });
    }

    const experience = await InterviewExperience.create({
      userId, company, role, year, questionsAsked, tips, difficulty, verdict
    });

    // Reward points for sharing an experience
    await User.findByIdAndUpdate(userId, { $inc: { points: 100, orbitCoins: 100 } });
    const progress = await getOrCreateProgress(userId);
    progress.interviewXP += 100;
    await progress.save();

    res.json({ success: true, experience });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /interview/progress ─────────────────────────────────────────────────
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const progress = await getOrCreateProgress(userId);
    
    // Fetch stats
    const totalExperiencesShared = await InterviewExperience.countDocuments({ userId });
    const totalMocks = await MockInterview.countDocuments({ userId, status: 'completed' });

    res.json({
      progress: {
        solvedQuestions: progress.solvedQuestions,
        sheetProgress: progress.sheetProgress,
        mockInterviewCount: progress.mockInterviewCount || totalMocks,
        interviewXP: progress.interviewXP
      },
      totalExperiencesShared
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle solved state for a question
exports.toggleQuestionSolved = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId } = req.body;

    const progress = await getOrCreateProgress(userId);
    const index = progress.solvedQuestions.indexOf(questionId);
    let solved = false;
    let pointsEarned = 0;

    if (index === -1) {
      progress.solvedQuestions.push(questionId);
      solved = true;
      pointsEarned = 15; // 15 XP per question solved
      progress.interviewXP += pointsEarned;
      await User.findByIdAndUpdate(userId, { $inc: { points: pointsEarned, orbitCoins: pointsEarned } });
    } else {
      progress.solvedQuestions.splice(index, 1);
      pointsEarned = -15;
      progress.interviewXP = Math.max(0, progress.interviewXP + pointsEarned);
      await User.findByIdAndUpdate(userId, { $inc: { points: pointsEarned, orbitCoins: pointsEarned } });
    }

    await progress.save();
    res.json({ success: true, solved, interviewXP: progress.interviewXP });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── POST /interview/mock ────────────────────────────────────────────────────
exports.handleMockInterview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mode, userMessage, sessionId } = req.body;

    const MAX_QUESTIONS = 5;

    // A. Init session
    if (!sessionId) {
      if (!mode) return res.status(400).json({ error: 'Interview mode required to initialize.' });
      
      const systemPrompt = `You are CodeOrbit AI, an elite software engineering interviewer. 
Conduct a mock interview for the mode: "${mode.toUpperCase()}".
Rules:
1. Ask exactly 5 questions, one by one. Do NOT ask multiple questions at once.
2. Wait for the user's response to each question before evaluating it and asking the next one.
3. Keep your questions realistic, technical, and professional.
4. For the first message, greet the user, introduce yourself, and state the first question clearly. Do not output anything else.`;

      const completion = await client.chat.completions.create({
        model: getModel(),
        messages: [{ role: 'system', content: systemPrompt }],
        temperature: 0.7,
        max_tokens: 400
      });

      const firstQuestion = completion.choices[0].message.content;

      const session = await MockInterview.create({
        userId,
        mode,
        status: 'in_progress',
        chatHistory: [
          { role: 'assistant', content: firstQuestion }
        ]
      });

      return res.json({
        sessionId: session._id,
        status: 'in_progress',
        question: firstQuestion,
        chatHistory: session.chatHistory
      });
    }

    // B. Interactive loop
    const session = await MockInterview.findOne({ _id: sessionId, userId });
    if (!session) return res.status(404).json({ error: 'Interview session not found.' });

    if (session.status === 'completed') {
      return res.json({ status: 'completed', scores: session.scores, feedback: session.feedback, suggestions: session.suggestions });
    }

    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ error: 'Message required.' });
    }

    // Append user message
    session.chatHistory.push({ role: 'user', content: userMessage });

    const totalUserQuestions = session.chatHistory.filter(h => h.role === 'user').length;

    // Check if we reached the end of the interview
    if (totalUserQuestions >= MAX_QUESTIONS) {
      // End interview, generate evaluation
      const systemPrompt = `You are the CodeOrbit AI Interview Evaluator.
Review the mock interview transcript provided below and generate a thorough, professional interview feedback report.
Provide:
1. Scores from 1 to 100 for: Communication, Technical Depth, and Confidence.
2. A detailed feedback paragraph.
3. A list of 3-5 constructive suggestions for improvement.

Your response MUST be valid JSON in this exact format:
{
  "scores": {
    "communication": 85,
    "technical": 78,
    "confidence": 90,
    "overall": 84
  },
  "feedback": "...",
  "suggestions": ["...", "..."]
}`;

      const historyFormatted = session.chatHistory.map(h => ({
        role: h.role,
        content: h.content
      }));

      const completion = await client.chat.completions.create({
        model: getModel(),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here is the interview transcript:\n${JSON.stringify(historyFormatted)}` }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" }
      });

      let evaluation;
      try {
        evaluation = JSON.parse(completion.choices[0].message.content);
      } catch (err) {
        evaluation = {
          scores: { communication: 70, technical: 70, confidence: 70, overall: 70 },
          feedback: "Great job completing the interview. Work on providing structured answers.",
          suggestions: ["Practice behavioral frameworks like STAR.", "Deepen knowledge of time complexities."]
        };
      }

      session.scores = evaluation.scores;
      session.feedback = evaluation.feedback;
      session.suggestions = evaluation.suggestions;
      session.status = 'completed';
      await session.save();

      // Reward points for mock completion
      const rewardPoints = 250; // High reward for a full mock session
      await User.findByIdAndUpdate(userId, { $inc: { points: rewardPoints, orbitCoins: rewardPoints } });
      const progress = await getOrCreateProgress(userId);
      progress.mockInterviewCount += 1;
      progress.interviewXP += rewardPoints;
      await progress.save();

      return res.json({
        status: 'completed',
        scores: session.scores,
        feedback: session.feedback,
        suggestions: session.suggestions,
        chatHistory: session.chatHistory
      });
    }

    // Continue interview, ask next question
    const systemPrompt = `You are CodeOrbit AI, conducting an interview.
Ask the next logical question for this mock interview. 
Keep your question clear, technical, and targeted.
Ensure that you DO NOT answer your own question or print feedback in this turn. Just ask the next question.`;

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...session.chatHistory.map(h => ({ role: h.role, content: h.content }))
    ];

    const completion = await client.chat.completions.create({
      model: getModel(),
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 300
    });

    const nextQuestion = completion.choices[0].message.content;
    session.chatHistory.push({ role: 'assistant', content: nextQuestion });
    await session.save();

    res.json({
      status: 'in_progress',
      question: nextQuestion,
      chatHistory: session.chatHistory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── POST /interview/resume ─────────────────────────────────────────────────
exports.handleResumeInterview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { resumeText, userMessage, sessionId } = req.body;

    const MAX_QUESTIONS = 5;

    // A. Init session
    if (!sessionId) {
      if (!resumeText || !resumeText.trim()) {
        return res.status(400).json({ error: 'Resume text is required to initialize.' });
      }

      // Step 1: Parse resume projects & skills using LLM
      const parsingPrompt = `Analyze the resume text provided below. Extract the top technical skills and the names and details of projects.
Return the output strictly in this JSON format:
{
  "skills": ["JavaScript", "React", "Node.js"],
  "projects": [
    { "title": "Project Name", "description": "Short description of project" }
  ]
}`;

      const parseResult = await client.chat.completions.create({
        model: getModel(),
        messages: [
          { role: 'system', content: parsingPrompt },
          { role: 'user', content: resumeText }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      let parsedData;
      try {
        parsedData = JSON.parse(parseResult.choices[0].message.content);
      } catch (_) {
        parsedData = { skills: [], projects: [] };
      }

      // Step 2: Initialize mock interview focused on the resume
      const systemPrompt = `You are CodeOrbit AI, conducting a resume-based software engineering interview.
Skills: ${parsedData.skills.join(', ')}
Projects: ${JSON.stringify(parsedData.projects)}

Rules:
1. Conduct a mock interview focusing on the user's projects, technical choices, skills, and architectures.
2. Ask exactly 5 questions, one by one.
3. Be professional and technical (e.g. "Explain the architecture of X", "How did you scale Y?", "What databases did you choose for Z?").
4. For the first message, greet the user, mention a specific project or skill from their resume, and ask the first question. Do not output anything else.`;

      const completion = await client.chat.completions.create({
        model: getModel(),
        messages: [{ role: 'system', content: systemPrompt }],
        temperature: 0.7,
        max_tokens: 300
      });

      const firstQuestion = completion.choices[0].message.content;

      const session = await MockInterview.create({
        userId,
        mode: 'resume',
        status: 'in_progress',
        chatHistory: [
          { role: 'assistant', content: firstQuestion }
        ]
      });

      return res.json({
        sessionId: session._id,
        status: 'in_progress',
        question: firstQuestion,
        chatHistory: session.chatHistory,
        parsedSkills: parsedData.skills,
        parsedProjects: parsedData.projects
      });
    }

    // B. Interactive loop (exact same loop as standard mock)
    const session = await MockInterview.findOne({ _id: sessionId, userId });
    if (!session) return res.status(404).json({ error: 'Interview session not found.' });

    if (session.status === 'completed') {
      return res.json({ status: 'completed', scores: session.scores, feedback: session.feedback, suggestions: session.suggestions });
    }

    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ error: 'Message required.' });
    }

    session.chatHistory.push({ role: 'user', content: userMessage });

    const totalUserQuestions = session.chatHistory.filter(h => h.role === 'user').length;

    if (totalUserQuestions >= MAX_QUESTIONS) {
      // Evaluate
      const systemPrompt = `You are the CodeOrbit AI Resume Interview Evaluator.
Review the mock interview transcript provided below and generate a thorough, professional interview feedback report.
Provide:
1. Scores from 1 to 100 for: Communication, Technical Depth, and Confidence.
2. A detailed feedback paragraph focusing on how well they defended their resume details.
3. A list of 3-5 constructive suggestions for improvement.

Your response MUST be valid JSON in this exact format:
{
  "scores": {
    "communication": 85,
    "technical": 78,
    "confidence": 90,
    "overall": 84
  },
  "feedback": "...",
  "suggestions": ["...", "..."]
}`;

      const historyFormatted = session.chatHistory.map(h => ({
        role: h.role,
        content: h.content
      }));

      const completion = await client.chat.completions.create({
        model: getModel(),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here is the interview transcript:\n${JSON.stringify(historyFormatted)}` }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" }
      });

      let evaluation;
      try {
        evaluation = JSON.parse(completion.choices[0].message.content);
      } catch (err) {
        evaluation = {
          scores: { communication: 70, technical: 70, confidence: 70, overall: 70 },
          feedback: "Great job completing the resume interview. Work on clarifying project design decisions.",
          suggestions: ["Explain system architectures starting with high-level block diagrams.", "Quantify project impact and metrics."]
        };
      }

      session.scores = evaluation.scores;
      session.feedback = evaluation.feedback;
      session.suggestions = evaluation.suggestions;
      session.status = 'completed';
      await session.save();

      // Reward points
      const rewardPoints = 250;
      await User.findByIdAndUpdate(userId, { $inc: { points: rewardPoints, orbitCoins: rewardPoints } });
      const progress = await getOrCreateProgress(userId);
      progress.mockInterviewCount += 1;
      progress.interviewXP += rewardPoints;
      await progress.save();

      return res.json({
        status: 'completed',
        scores: session.scores,
        feedback: session.feedback,
        suggestions: session.suggestions,
        chatHistory: session.chatHistory
      });
    }

    // Continue
    const systemPrompt = `You are CodeOrbit AI, conducting a resume-based interview.
Ask the next logical question focusing on their skills, projects, or implementation choices.
Do not output anything else than the single next question.`;

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...session.chatHistory.map(h => ({ role: h.role, content: h.content }))
    ];

    const completion = await client.chat.completions.create({
      model: getModel(),
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 300
    });

    const nextQuestion = completion.choices[0].message.content;
    session.chatHistory.push({ role: 'assistant', content: nextQuestion });
    await session.save();

    res.json({
      status: 'in_progress',
      question: nextQuestion,
      chatHistory: session.chatHistory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
