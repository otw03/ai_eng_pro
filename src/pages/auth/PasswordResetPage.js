import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { useNavigate, useLocation  } from "react-router-dom";
import axios from 'axios';

const Container = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  /* width: 100%; */ // 확인 버튼과 넓이를 맞추기 위해 제거함
  width: 200px; // 확인 버튼과 넓이를 맞추기 위해 추가함
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 222px; // 인풋창과 넓이를 맞추기 위해 추가함
  display: inline-block;
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

const PasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [ConfirmNewPassword, setConfirmNewPassword] = useState('');
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();
  const location = useLocation(); // 위치를 가져옵니다.

  // 비밀번호 인증 코드 입력 페이지에서 전달 받은 userName를 설정
  useEffect(() => {
    console.log(location);
    console.log(location.state);    
    console.log(location.state.userName);
    if (location.state && location.state.userName) {
      setUserName(location.state.userName);
    }
  }, [location]);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    // 비밀번호 재설정 처리 로직
    if(newPassword === ConfirmNewPassword) {
      try {
          const response = await axios.post('/find-password/reset-code/reset-password', { newPassword, userName });
          if (response.status === 200) {
            alert(response.data.message);
            console.log("비밀번호 재설정");
            navigate("/");
          }
      } catch (error) {
          console.log(error);
          alert("비밀번호 변경에 실패했습니다.");
      }
    } else {
      alert("비밀번호가 일치하지 않습니다. 다시 입력하세요.");
    }   

  };

  return (
    <Container>
      <Title>비밀번호 재설정</Title>
      <Form onSubmit={handleResetSubmit}>
        <FormGroup>
          <Label htmlFor="password">새 비밀번호</Label>
          <Input
            type="password"
            id="password"
            name="password"
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호를 입력하세요"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="비밀번호를 한번 더 입력하세요"
          />
        </FormGroup>
        <Button type="submit">확인</Button>
      </Form>
    </Container>
  );
};

export default PasswordResetPage;
