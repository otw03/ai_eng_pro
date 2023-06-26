import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
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

const FindIdPage = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    // 아이디 찾기 처리 로직
    try {
      const response = await axios.post("/find/find-id", { email });
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
    console.log('아이디 찾기 - 이메일 전송');
    navigate("/");
  };

  return (
    <Container>
      <Title>아이디 찾기</Title>
      <Form onSubmit={handleEmailSubmit}>
        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <Input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력하세요" />
        </FormGroup>
        <Button type="submit">확인</Button>
      </Form>
    </Container>
  );
};

export default FindIdPage;

