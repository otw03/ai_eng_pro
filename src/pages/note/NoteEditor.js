import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import { useNavigate } from "react-router-dom";

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
`;

const InputTitle = styled.input`
  font-size: 2rem;
  font-weight: bold;
  outline: none;
  width: 100%;
  margin-bottom: 16px;
  border: none;
`;

const InputContent = styled.textarea`
  flex: 1;
  height: 16rem;
  resize: none;
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 1rem;
  outline: none;
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  outline: none;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
`;

const SaveButton = styled(Button)`
  background-color: #329af0;
`;

const CancelButton = styled(Button)`
  background-color: #d81e1e;
`;

const NoteEditor = ({ noteId, title, content, onSave, onCancel }) => {
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");

  useEffect(() => {
    setInputTitle(title || "");
    setInputContent(content || "");
  }, [title, content]);

  const saveAndGoBack = () => {
    onSave(noteId, inputTitle, inputContent);
  };

  const handleClickCancel = () => {
    onCancel();
  };

  return (
    <EditorContainer>
      <InputTitle
        type="text"
        placeholder="노트 제목"
        value={inputTitle}
        onChange={(e) => setInputTitle(e.target.value)}
      />
      <InputContent
        placeholder="노트의 내용"
        value={inputContent}
        onChange={(e) => setInputContent(e.target.value)}
      />
      <ButtonGroup>
        <SaveButton onClick={saveAndGoBack}>저장</SaveButton>
        <CancelButton onClick={handleClickCancel}>취소</CancelButton>
      </ButtonGroup>
    </EditorContainer>
  );
};

export default NoteEditor;
