import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';

const MenuItem = styled.li`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #e5e5e5;
  }
  display: flex;
  justify-content: space-between;
`;

const CreateBtn = styled.button`
  background-color: #4CAF50;
  padding: 5px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
`;

const DeleteBtn = styled.button`
  background-color: #f44336;
  margin-right: 12px;
  padding: 5px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
`;

const SubMenu = styled.ul`
  list-style-type: none;
  display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')};

  li {
    display: flex;
    justify-content: space-between;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
`;

const SidebarMenuItem = ({ title, itemList, onCreateChatRoom, onDeleteChatRoom, deleteNote, createNote }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log(itemList);

  const handleToggleMenu = event => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
    console.log("itemList", itemList);
  };

  // 채팅방 생성
  const handleCreateChatRoom = (event) => {
    event.stopPropagation();
    if (onCreateChatRoom) {
      onCreateChatRoom();
    }
  };
  
  // 채팅방 삭제
  const handleDeleteChatRoom = (event, roomId) => {
    event.stopPropagation();
    console.log(roomId);
    if (onDeleteChatRoom) {
      onDeleteChatRoom(roomId);
    }
  };

    // 노트 생성
    const handleCreateNote = (event) => {
      event.stopPropagation();
      if (createNote) {
        createNote();
      }
    };

  // 노트 삭제
  const handleDeleteNote = (event, noteId) => {
    event.stopPropagation();
    console.log(noteId);
    if (deleteNote) {
      deleteNote(noteId);
    }
  };

  return (
    <>
      <MenuItem onClick={handleToggleMenu}>
      <StyledNavLink
        to={title === "ChatRoom" ? "/main/chat" : "/main/note"}
        isActive={() => false}
      >
        {title}
      </StyledNavLink>
        <CreateBtn onClick={(event) => {handleCreateChatRoom(event); handleCreateNote(event);} } >+</CreateBtn>
      </MenuItem>
        <SubMenu isExpanded={isExpanded}>
          {itemList.map(item => (
            <li key={item.id}>
              <StyledNavLink to={`/main/${item.type}/${item.id}`}>
                {item.title}
              </StyledNavLink>
              <DeleteBtn onClick={(event) => {handleDeleteChatRoom(event, item.id); handleDeleteNote(event, item.id);}}>
                -
              </DeleteBtn>
            </li>
          ))}
        </SubMenu>
    </>
  );
};

export default SidebarMenuItem;