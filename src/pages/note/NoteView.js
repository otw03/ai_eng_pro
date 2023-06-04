import React from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

const NoteContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const Content = styled.p`
  font-size: 16px;
`;

const ButtonContainer = styled.div`
 -top: 20px;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #3c3c3c;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
`;

const NoteView = ({ notes, onEdit, deleteNote }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const note = notes.find((note) => note.id === parseInt(id));

  if (!note) return <NoteContainer>노트를 찾을 수 없습니다.</NoteContainer>;

  // 수정 버튼
  const handleEditClick = () => {
    onEdit(note.id, note.title, note.content);
  };

  // 삭제 버튼
  const handleDeleteClick = () => {
    deleteNote(note.id);
    navigate("/main/note");
  };

  return (
    <NoteContainer>
      <Title>{note.title}</Title>
      <Content>{note.content}</Content>
      <ButtonContainer>
        <Button onClick={handleEditClick}>수정</Button>
        <Button onClick={handleDeleteClick}>삭제</Button>
      </ButtonContainer>
    </NoteContainer>
  );
};

export default NoteView;
