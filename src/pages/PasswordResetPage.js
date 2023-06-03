import React from 'react';
import styled from 'styled-components';

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
  const handleResetSubmit = (e) => {
    e.preventDefault();
    // 비밀번호 재설정 처리 로직
    console.log('비밀번호 재설정');
  };

  return (
    <Container>
      <Title>비밀번호 재설정</Title>
      <Form onSubmit={handleResetSubmit}>
        <FormGroup>
          <Label htmlFor="password">새 비밀번호</Label>
          <Input type="password" id="password" name="password" placeholder="새 비밀번호를 입력하세요" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <Input type="password" id="confirmPassword" name="confirmPassword" placeholder="비밀번호를 한번 더 입력하세요" />
        </FormGroup>
        <Button type="submit">확인</Button>
      </Form>
    </Container>
  );
};

export default PasswordResetPage;

