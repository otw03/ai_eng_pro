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

// 요약하기 함수
async function summarize(answer) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Summarize this in English ###\n${answer}\n###`,
      },
    ],
    max_tokens: 500, // 토큰 수를 제한
  });
  console.log("요약하기 함수 결과 completion.data.choices[0].message: ", completion.data.choices[0].message);

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

// 채팅 메시지 저장
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
  console.log("채팅 기록 저장된 후 DB: ", chatRoom);

  res.status(201).json({ message: 'Message saved successfully.' });
});

// 채팅 메시지 가져오기
router.get('/:id/messages', async (req, res) => {
  const chatRoom = await ChatRoom.findById(req.params.id);
  if (!chatRoom) {
      res.status(404).json({ error: "Chat room not found" });
      return;
  }
  res.json({ conversation: chatRoom.conversation });
});


/* ai챗봇 대화 */
router.post('/:id', async (req, res) => {
  const userMessage = req.body.message;
  console.log("1 Received message from user:", userMessage);
  console.log("2: ", req.params.id);
  // 해당 id와 일치하는 DB의 데이터를 찾고
  const chatRoom = await ChatRoom.findById(req.params.id);
  console.log("3: ",chatRoom.summarizedConversationHistory);


  // 초기 conversationHistory를 DB에서 가져온 요약 대화 기록으로 설정
  const conversationHistory = chatRoom.summarizedConversationHistory
  ? [...chatRoom.summarizedConversationHistory]
  : [];
  console.log("3-2: ", conversationHistory);

  conversationHistory.push({ role: "user", content: userMessage });
  console.log("4: ",conversationHistory);

  // 기본 메시지
  const messages = [
    { role: "system", content: "You are a helpful assistant Please answer only in English." },
    ...conversationHistory,
  ];
  console.log("5: ",messages);
  console.log("6 Current conversation history:", conversationHistory);

  try {
    const answer = await sendQuestion(messages);
    console.log("7 Answer:", answer);

    const summarized = await summarize(answer);
    console.log("8 Summarized:", summarized);

    conversationHistory.push({
      role: "assistant",
      content: summarized,
    });

    res.json({ message: answer });

    console.log("9 Conversation history after response:", conversationHistory);
    // DB에 요약된 응답이 포함된 대화 기록 저장
    chatRoom.summarizedConversationHistory = conversationHistory;
    chatRoom.save();
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
