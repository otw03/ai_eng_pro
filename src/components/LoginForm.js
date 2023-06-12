import React from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
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
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
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

const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const LinkButton = styled(Button)`
  background-color: transparent;
  color: #007bff;

  &:hover {
    background-color: transparent;
    color: #0056b3;
  }
`;

const KakaoLoginButton = styled.button`
  display: inline-block;
  padding: 10px 20px;
  background-color: #ffe812;
  color: #3c1e1e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #e6c807;
  }
`;

const LoginForm = ({
  username, 
  setUsername,
  password, 
  setPassword,
  onLogin,

  onSignup,
  onForgotId,
  onForgotPw,
  onKakaoLogin,
}) => {
  const handleLogin = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <FormContainer>
      <Title>로그인</Title>
      <form onSubmit={handleLogin}>
        <FormGroup>
          <Label htmlFor="username">아이디</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={username}
            placeholder="아이디를 입력하세요"
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="비밀번호를 입력하세요"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button type="submit">로그인</Button>
      </form>
      <LinkContainer>
        <LinkButton onClick={onSignup}>회원가입</LinkButton>
        <LinkButton onClick={onForgotId}>아이디 찾기</LinkButton>
        <LinkButton onClick={onForgotPw}>비밀번호 찾기</LinkButton>
      </LinkContainer>
      <KakaoLoginButton onClick={onKakaoLogin}>
        카카오 계정으로 로그인
      </KakaoLoginButton>
    </FormContainer>
  );
};

export default LoginForm;
