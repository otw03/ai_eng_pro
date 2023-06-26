const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

router.post("/", async (req, res) => {
  const userMessage = req.body.message;
  console.log(userMessage);

  // OpenAI API 호출
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    console.log(completion.data.choices[0].message);

    res.json({ message: completion.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
