const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENAI_API_KEY ? undefined : "https://openrouter.ai/api/v1",
});

/**
 * Build the system prompt.
 * The problem context is ALWAYS injected into the system message so the
 * model cannot hallucinate a different problem.
 */
function buildSystemPrompt(context = {}) {
  const {
    problemId,
    problemTitle,
    difficulty,
    description,
    examples,
    constraints,
    tags,
    code,
    language,
  } = context;

  // ── Base identity & scope ──────────────────────────────────────────────────
  const identityBlock = `You are CodeOrbit AI, an expert DSA, Competitive Programming, and Interview Preparation mentor.

You ONLY answer questions related to:
- Data Structures and Algorithms
- Competitive Programming
- Coding problems and debugging
- Time and Space Complexity analysis
- System Design basics
- Programming languages (C++, Java, Python, JavaScript, etc.)

If the user asks about anything unrelated to coding or computer science, politely refuse and redirect them back to programming topics.

Always be educational. Prefer giving hints and guiding understanding over directly revealing full solutions.`;

  // ── Problem context block (always injected if available) ──────────────────
  if (!problemTitle) {
    return identityBlock + `\n\nNote: No specific problem context is currently loaded. Answer general coding questions only.`;
  }

  const contextBlock = `
══════════════════════════════════════════
CURRENT PROBLEM CONTEXT
══════════════════════════════════════════
Problem ID   : ${problemId || 'N/A'}
Title        : ${problemTitle}
Difficulty   : ${difficulty || 'Unknown'}
Tags         : ${tags || 'General'}
══════════════════════════════════════════

PROBLEM DESCRIPTION:
${description || 'No description available.'}

EXAMPLES:
${examples || 'No examples available.'}

CONSTRAINTS:
${constraints || 'No constraints listed.'}

USER'S CURRENT CODE (${language || 'unknown language'}):
\`\`\`${language || ''}
${code || 'No code written yet.'}
\`\`\`
══════════════════════════════════════════

IMPORTANT RULES:
1. You are ONLY aware of the problem described above ("${problemTitle}"). 
   Do NOT reference, explain, or confuse this with any other problem.
2. When the user asks to "explain the problem", explain ONLY "${problemTitle}".
3. When the user asks for a "hint", give hints ONLY for "${problemTitle}".
4. When the user asks to "debug my code", analyze ONLY the code shown above.
5. All responses must be specific to this exact problem, not generic advice.
6. Give hints progressively — start with small observations, escalate only when asked.
7. Never reveal the complete solution immediately unless the user explicitly asks for it.`;

  return identityBlock + contextBlock;
}

const solveDoubt = async (req, res) => {
  try {
    const {
      message,
      messages: legacyMessages,
      history = [],
      context = {}
    } = req.body;

    const userMessage = message || legacyMessages;

    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ reply: "Please provide a message.", message: "Please provide a message." });
    }

    // Build the locked-in system prompt with full problem context
    const systemPrompt = buildSystemPrompt(context);

    // Normalize conversation history roles (user/assistant only)
    const formattedHistory = history
      .filter(h => h.role === 'user' || h.role === 'assistant' || h.role === 'model')
      .slice(-20) // Keep last 20 messages to avoid token bloat
      .map(h => ({
        role:    h.role === 'model' ? 'assistant' : h.role,
        content: h.content || ''
      }));

    const model = process.env.OPENAI_API_KEY ? "gpt-3.5-turbo" : "openai/gpt-3.5-turbo";

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system",    content: systemPrompt },
        ...formattedHistory,
        { role: "user",      content: userMessage }
      ],
      temperature: 0.6,
      max_tokens: 1500,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I could not generate a response.";

    res.status(200).json({
      reply,
      message: reply // backward compat for legacy ChatAi.jsx
    });

  } catch (err) {
    console.error("AI Assistant Error:", err.message || err);

    const friendlyError = "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
    res.status(500).json({
      reply:   friendlyError,
      message: friendlyError,
      error:   err.message
    });
  }
};

module.exports = solveDoubt;