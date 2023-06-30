import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import ChatRoom from "../chat/ChatRoom";

import NoteList from "../note/NoteList";
import NoteEditor from "../note/NoteEditor";
import NoteView from "../note/NoteView";

import { BrowserRouter as Router, Routes, Route, useNavigate, } from "react-router-dom";
import axios from "axios";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex-grow: 1;
  background-color: #e5e5e5;
`;

// 채팅 입력창 우측하단으로 이동시키려고한 흔적
// const ChatRoomWrapper = styled.div`
//   top: 0%;
//   left: 0%;
//   transform: translate(65%, -2.3%);
//   bottom: 0;
//   right: 0;
// `;

const MainComponent = () => {
  const sidebarRef = useRef();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get('/auth/logout');
      if (response.status === 200) {
        navigate("/");
      } else {
        alert('로그아웃하는 동안 오류가 발생했습니다. 다시 시도하십시오.');
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
    console.log("로그아웃 이벤트 처리");
  };


  // 채팅방 상태관리
  const [chatRooms, setChatRooms] = useState([]);
  console.log(chatRooms);

  // 노트 추가 로직
  const [notes, setNotes] = useState([
    { id: 1, title: "Note 1", content: "content1" },
    { id: 2, title: "Note 2", content: "content2" },
  ]);

  // `noteId`, `noteTitle`, `noteContent` 상태 관리
  const [noteId, setNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  // 노트 추가 버튼 클릭 로직
  const createNote = () => {
    console.log("노트 추가 버튼이 클릭되었습니다.");
    navigate("/main/note/new");
  };

  // 노트 저장 수정
  const saveNote = (id, title, content) => {
    if (id) {
      const updatedNotes = notes.map((note) => {
        if (note.id === id) {
          return { ...note, title, content };
        }
        return note;
      });
      // console.log("업데이트 됨");
      setNotes(updatedNotes);
    } else {
      const newNote = { id: Date.now(), title, content };
      setNotes([...notes, newNote]);
      // console.log("새로 추가 됨");
    }
    navigate("/main/note");
  };

  const cancelNoteEditing = () => {
    navigate("/main/note");
  };

  // 수정하기
  const handleEdit = (id, title, content) => {
    setNoteId(id);
    setNoteTitle(title);
    setNoteContent(content);
    navigate(`/main/note/edit/${id}`);
  };

  return (
    <AppContainer>
      <Header username="오태원" onLogout={handleLogout} />
      <MainContainer>
        <Sidebar ref={sidebarRef} chatRooms={chatRooms} setChatRooms={setChatRooms} />
        {
          <Routes>
            {chatRooms.map((room) => (
              <Route key={room.id} path={`/chat/${room.id}`} element={<ChatRoom />} />
            ))}
            <Route
              path="/note"
              element={<NoteList notes={notes} deleteNote={deleteNote} createNote={createNote} />}
            />

            <Route path="/note/view/:id" element={<NoteView notes={notes} onEdit={handleEdit} deleteNote={deleteNote} />} />

            <Route path="/note/edit/:id" element={<NoteEditor noteId={noteId} title={noteTitle} content={noteContent} onSave={saveNote} onCancel={cancelNoteEditing} />} />

            <Route path="/note/new" element={<NoteEditor onSave={saveNote} onCancel={cancelNoteEditing} />} />
          </Routes>
        }
      </MainContainer>
    </AppContainer>
  );
};

const Main = () => {
  return (
      <MainComponent />
  );
};

export default Main;
