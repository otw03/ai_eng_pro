import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const FindPasswordPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    // 비밀번호 찾기 처리 로직
    try {
      const response = await axios.post("/find/find-password", { email, username });
      if (response.status === 200) {
        alert(response.data.message);
        console.log("비밀번호 찾기 - 이메일 전송");
        navigate("/find-password/reset-code");
      }
    } catch (error) {
      alert(error.response.data.message);
    }

  };

  return (
    <Container>
      <Title>비밀번호 찾기</Title>
      <Form onSubmit={handleEmailSubmit}>
        <FormGroup>
          <Label htmlFor="username">아이디</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디를 입력하세요"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="가입한 이메일을 입력하세요"
          />
        </FormGroup>
        <Button type="submit">확인</Button>
      </Form>
    </Container>
  );
};

export default FindPasswordPage;
