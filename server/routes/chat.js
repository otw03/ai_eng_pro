const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

// 지난 대화 이력을 저장할 배열
const conversationHistory = [];

router.post("/", async (req, res) => {
  const userMessage = req.body.message;
  console.log(userMessage);

  // 사용자 메시지를 대화 이력에 추가
  conversationHistory.push({ role: "user", content: userMessage });

  // OpenAI API 호출
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    // 시스템 메시지와 대화 이력을 결합한 새 배열 생성
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      ...conversationHistory,
    ];

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });
    console.log(completion.data.choices[0].message);

    // 가상 도우미의 응답을 대화 이력에 추가
    conversationHistory.push({
      role: "assistant",
      content: completion.data.choices[0].message.content,
    });

    res.json({ message: completion.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
