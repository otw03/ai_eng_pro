import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
`;

const Logo = styled.h1`
  font-size: 24px;
  margin: 0;
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Username = styled.span`
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Header = ({ username, onLogout }) => {
  return (
    <HeaderContainer>
      <Logo onClick={() => console.log('홈버튼 클릭')}>Home</Logo>
      <UserInfo>
        <Username>{username}</Username>
        <Button onClick={() => console.log('내정보 버튼 클릭')}>내정보</Button> 
        {/* 내정보 클릭 로직 추가해 줘야함 */}
        <Button onClick={onLogout}>로그아웃</Button>
      </UserInfo>
    </HeaderContainer>
  );
};

export default Header;


