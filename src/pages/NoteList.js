import React from "react";
import styled from "styled-components";
// import { Link } from "react-router-dom";

import Note from "./Note";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`;

const NoteTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  // Link 밑줄 없애기
  a {
    text-decoration: none;
  }
`;

const Button = styled.button`
  background-color: #f1c40f;
  border: none;
  border-radius: 3px;
  color: white;
  padding: 0.25rem 0.5rem;
  -size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #f39c12;
  }
`;

const NoteList = ({ notes, deleteNote, createNote }) => {
  return (
    <Container>
      <h2>노트 목록</h2>
      {notes.map((note) => (
        <NoteTitle key={note.id}>
          <Note note={note} />
          <Button onClick={() => deleteNote(note.id)}>삭제</Button>
        </NoteTitle>
      ))}
      <Button onClick={createNote}>노트 추가</Button>
    </Container>
  );
};

export default NoteList;
