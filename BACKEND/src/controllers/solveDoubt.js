const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const solveDoubt = async (req, res) => {
  try {

    const {
      messages,
      title,
      description
    } = req.body;

    const completion = await client.chat.completions.create({
  model: "openai/gpt-3.5-turbo",

  messages: [
    {
      role: "system",
      content: `
You are a DSA tutor.

Problem:
${title}

Description:
${description}

Help users solve only this DSA problem.
`
    },
    {
      role: "user",
      content: messages
    }
  ]
});
    res.status(200).json({
      message: completion.choices[0].message.content
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = solveDoubt;