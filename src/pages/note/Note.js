import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NoteContainer = styled.div`
  cursor: pointer;
`;

const Note = ({ note }) => {
  if (!note) return null;

  return (
    <NoteContainer>
      <h3>
        <Link to={`/main/note/${note.id}`}>{note.title}</Link>
      </h3>
    </NoteContainer>
  );
};

export default Note;
