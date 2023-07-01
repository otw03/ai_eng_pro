const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const ChatRoom = require("../models/ChatRoom");

dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const conversationHistory = [];

// 요약하기 함수
async function summarize(answer) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Summarize this ###\n${answer}\n###`,
      },
    ],
    max_tokens: 500, // 토큰 수를 제한
  });
  console.log(completion.data.choices[0].message);

  return completion.data.choices[0].message.content;
}

// 질문하기 함수
async function sendQuestion(messages) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
    max_tokens: 500, // 토큰 수를 제한
  });
  console.log(completion.data.choices[0].message);

  return completion.data.choices[0].message.content;
}

// 새로운 대화방 생성
router.post("/create", async (req, res) => {
  console.log(req.body);
  console.log(req.body.title);
  const chatRoom = new ChatRoom({ 
    title: req.body.title, 
  });
  console.log("Created chat room:", chatRoom);
  await chatRoom.save();
  res.json({ chatRoom });
});

// 채팅방 목록 가져오기
router.get("/rooms", async (req, res) => {
  const chatRooms = await ChatRoom.find();
  res.json({ chatRooms });
});

// 채팅방 삭제
router.delete("/:id", async (req, res) => {
  console.log(req.params.id);
  const deletedRoom = await ChatRoom.findByIdAndDelete(req.params.id);
  console.log(deletedRoom);
  if (!deletedRoom){
    res.status(404).json({ error: "Chat room not found" });
    return;
  }
  res.json({ success: true });
});

// 채팅 메시지 저장 및 읽어오기
router.post('/:id/messages', async (req, res) => {
  console.log(req.params);
  const chatRoom = await ChatRoom.findById(req.params.id);
  if (!chatRoom) {
      res.status(404).json({ error: "Chat room not found" });
      return;
  }
  console.log(chatRoom.conversation);
  chatRoom.conversation.push(req.body.message);
  await chatRoom.save();

  res.status(201).json({ message: 'Message saved successfully.' });
});

router.get('/:id/messages', async (req, res) => {
  const chatRoom = await ChatRoom.findById(req.params.id);
  if (!chatRoom) {
      res.status(404).json({ error: "Chat room not found" });
      return;
  }
  res.json({ conversation: chatRoom.conversation });
});


/* ai챗봇 대화 */
router.post("/", async (req, res) => {
  const userMessage = req.body.message;
  console.log("Received message from user:", userMessage);

  conversationHistory.push({ role: "user", content: userMessage });
  console.log(conversationHistory);

  // 기본 메시지
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    ...conversationHistory,
  ];
  console.log(messages);
  console.log("Current conversation history:", conversationHistory);

  try {
    const answer = await sendQuestion(messages);
    console.log("Answer:", answer);

    const summarized = await summarize(answer);
    console.log("Summarized:", summarized);

    conversationHistory.push({
      role: "assistant",
      content: summarized,
    });

    res.json({ message: answer });

    console.log("Conversation history after response:", conversationHistory);
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 429) {
      // 요청 수 초과시 처리
      return res.status(429).json({ error: "Too many requests" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

module.exports = router;
