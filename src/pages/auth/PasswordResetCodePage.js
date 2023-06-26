import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
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

const PasswordResetCodePage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  
  const navigate = useNavigate();

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    // 인증 코드 확인 처리 로직
    try {
      const response = await axios.post('/find/find-password/reset-code', { verificationCode });
      console.log(response.data);
      if (response.status === 200) {
        alert(`${response.data.username} ${response.data.message}`);
        console.log('비밀번호 인증 코드 확인');
        navigate("/find-password/reset-code/reset-password", {
          state: { userName: response.data.username },
        });
      }
    } catch (error) {
        alert(error.response.data.message);
        console.log(error);
    }
  };

  return (
    <Container>
      <Title>비밀번호 인증 코드 입력</Title>
      <Form onSubmit={handleCodeSubmit}>
        <FormGroup>
          <Label htmlFor="code">인증 코드</Label>
          <Input type="text" id="code" name="code" onChange={(e) => setVerificationCode(e.target.value)} placeholder="인증 코드를 입력하세요" />
        </FormGroup>
        <Button type="submit">확인</Button>
      </Form>
    </Container>
  );
};

export default PasswordResetCodePage;

