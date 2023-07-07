import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import SidebarMenuItem from './SidebarMenuItem';
import axios from 'axios';

// 사이드바 접고 펴는 토글 버튼
const ToggleButton = styled.button`
  padding: 5px 10px;
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

// isCollapsed prop에 따라 너비를 20px 또는 200px로 조절하고 CSS 트랜지션 효과를 적용 (20px인 이유는 접었을 때 토글 버튼이 보이게 하기 위해서)
const SidebarContainer = styled.div`
  width: ${({ isCollapsed }) => (isCollapsed ? '20px' : '200px')};
  overflow: hidden;
  transition: width 0.3s;
  background-color: #f5f5f5;
`;

// 사이드바가 접혀 있는 경우에 사이드바 내부의 컨텐츠가 모두 표시되지 않게 함 
const SidebarContent = styled.div`
  display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'block')};
`;

const Menu = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const Sidebar = ({ chatRooms, setChatRooms, notes, setNotes, deleteNote, createNote }) => {
  // 사이드바 상태
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 사이드바 토글 버튼 이벤트
  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 채팅방 목록 가져오기 함수
  const fetchChatRooms = async () => {
    try {
      const response = await axios.get('/chat/rooms');
      const fetchedChatRooms = response.data.chatRooms;
      console.log(fetchedChatRooms);
      console.log(chatRooms);
      // fetchedChatRooms 배열을 순회하여 새로운 채팅방 목록을 생성
      const newRooms = fetchedChatRooms.map((room, index) => ({
        id: room._id,
        title: room.title,
        type: 'chat',
      }));

      setChatRooms([...chatRooms, ...newRooms]);
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
    }
  };

  // Note 목록 조회
  const fetchNotes = async () => {
    try {
      const response = await axios.get('/note');
      const fetchedNotes = response.data;
      console.log(fetchedNotes);
      console.log(notes);
      // fetchedChatRooms 배열을 순회하여 새로운 채팅방 목록을 생성
      const newNotes = fetchedNotes.map((note, index) => ({
        id: note._id,
        title: note.title,
        content: note.content,
        type: 'note',
      }));
      
      setNotes([...notes, ...newNotes]);
      console.log(newNotes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
    fetchNotes();
  }, []);

  // 채팅방 생성
  const handleCreateChatRoom = async () => {
    const postData = {
      title: `대화방${chatRooms.length + 1}`,
    };
    const response = await axios.post('/chat/create', postData);
    console.log('Created chat room:', response.data.chatRoom);
    
    const newRoom = {
      id: response.data.chatRoom._id,
      title: response.data.chatRoom.title,
      type: 'chat',
    };
    setChatRooms([...chatRooms, newRoom]);
  };
  
  // 채팅방 삭제
  const handleDeleteChatRoom = async (roomId) => {
    console.log(roomId);
    try {
      const response = await axios.delete(`/chat/${roomId}`);
      console.log('Deleted chat room:', roomId);

      // 상태 코드가 200(성공)인 경우에만 채팅방 목록에서 삭제
      if (response.status === 200) {
        setChatRooms(chatRooms.filter((room) => room.id !== roomId));
      } else {
        console.error('Failed to delete chat room:', response.status);
      }
    } catch (error) {
      // 삭제 과정에서 오류가 발생한 경우
      console.error('Failed to delete chat room:', error);
    }
  };

  return (
    /* 사이드바가 접히고 펼쳐지는 기능 */
    <SidebarContainer isCollapsed={isCollapsed}>
      <ToggleButton onClick={handleToggleSidebar}>
        {isCollapsed ? '>' : '<'}
      </ToggleButton>
      <SidebarContent isCollapsed={isCollapsed} > {/* 사이드바를 토글하였을 때 사이드바 내부의 컨텐츠를 숨기는 코드 */}
        <Menu>
          <SidebarMenuItem title="ChatRoom" itemList={chatRooms} onCreateChatRoom={handleCreateChatRoom} onDeleteChatRoom={handleDeleteChatRoom} />
          <SidebarMenuItem title="NoteList" itemList={notes} deleteNote={deleteNote} createNote={createNote} />
        </Menu>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;

