import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ChatMessages = styled.div`
  overflow-y: auto;
  margin-bottom: 10px;
`;

const Message = styled.div`
  margin-bottom: 10px;
`;

const Sender = styled.span`
  font-weight: bold;
`;

const Text = styled.span``;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: flex-end;
`;

const ChatInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
  margin-right: 10px;
`;

const ChatButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { id } = useParams();

  // 채팅방 메시지 가져오기
  const fetchChatRoomMessages = async () => {
    try {
      const response = await axios.get(`/chat/${id}/messages`);
      const fetchedMessages = response.data.conversation;
      console.log(fetchedMessages);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to fetch chat room messages:', error);
    }
  };

  useEffect(() => {
    fetchChatRoomMessages();
  }, [id]);

  const handleSendMessage = async () => {
    // if (newMessage.trim() !== '') {
    //   setMessages((prevMessages) => [...prevMessages, { role: 'user', content: newMessage }]);

    //   try {
    //     const response = await axios.post('/chat', { message: newMessage });
    //     const aiMessage = response.data.message;
    //     console.log(aiMessage);
    //     setMessages((prevMessages) => [
    //       ...prevMessages,
    //       { role: 'assistant', content: aiMessage },
    //     ]);

    //     // 채팅방에 메시지 저장
    //     await axios.post(`/chat/room/${id}/messages`, { message: { role: "user", content: newMessage } });
    //     await axios.post(`/chat/room/${id}/messages`, { message: { role: "assistant", content: aiMessage } });
    //   } catch (error) {
    //     console.error('Error sending message:', error);
    //   }
      
    //   setNewMessage('');
    // }
  };

  return (
    <ChatContainer>
      <ChatMessages>
        {messages.map((message, index) => (
          <Message key={index}>
            <Sender>{message.role}: </Sender>
            <Text>{message.content}</Text>
          </Message>
        ))}
      </ChatMessages>
      <ChatInputContainer>
        <ChatInput
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <ChatButton onClick={handleSendMessage}>전송</ChatButton>
      </ChatInputContainer>
    </ChatContainer>
  );
};

export default ChatRoom;

