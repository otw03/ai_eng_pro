import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import axios from 'axios';

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

const SignupForm = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post('/auth/signup', formData);
      console.log(response);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormContainer>
      <Title>회원가입</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="username">아이디</Label>
          <Input type="text" id="username" name="username" placeholder="아이디을 입력하세요" value={formData.username} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input type="password" id="password" name="password" placeholder="비밀번호를 입력하세요" value={formData.password} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="confirm-password">비밀번호 확인</Label>
          <Input type="password" id="confirm-password" name="confirmPassword" placeholder="비밀번호를 다시 입력하세요" value={formData.confirmPassword} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="name">이름</Label>
          <Input type="text" id="name" name="name" placeholder="이름을 입력하세요" value={formData.name} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <Input type="email" id="email" name="email" placeholder="이메일을 입력하세요" value={formData.email} onChange={handleChange} />
        </FormGroup>
        <Button type="submit">가입하기</Button>
      </form>
    </FormContainer>
  );
};

export default SignupForm;







































// 리덕스 툴킷 이용한 예제 참고용
// import React from 'react';
// import styled from "styled-components";
// import { useDispatch, useSelector } from 'react-redux';
// import { setUsername, setEmail, setPassword } from '../slices/userSlice';

// const SignupForm = () => {
//   const dispatch = useDispatch();
//   const { username, email, password } = useSelector((state) => state.user);

//   const handleUsernameChange = (event) => {
//     dispatch(setUsername(event.target.value));
//   };

//   const handleEmailChange = (event) => {
//     dispatch(setEmail(event.target.value));
//   };

//   const handlePasswordChange = (event) => {
//     dispatch(setPassword(event.target.value));
//   };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
//     // 입력된 데이터를 서버로 전송하거나 처리
//     console.log(username, email, password);
//   };

//   return (
//     <div>
//       <h2>회원가입</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           이름:
//           <input
//             type="text"
//             value={username}
//             onChange={handleUsernameChange}
//           />
//         </label>
//         <br />
//         <label>
//           이메일:
//           <input
//             type="email"
//             value={email}
//             onChange={handleEmailChange}
//           />
//         </label>
//         <br />
//         <label>
//           비밀번호:
//           <input
//             type="password"
//             value={password}
//             onChange={handlePasswordChange}
//           />
//         </label>
//         <br />
//         <button type="submit">가입하기</button>
//       </form>
//     </div>
//   );
// }

// export default SignupForm;