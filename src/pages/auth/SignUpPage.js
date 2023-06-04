import React from 'react';
import SignupForm from '../../components/SignupForm';
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    // 회원가입 처리 로직
    console.log('회원가입');
    navigate("/");
  };

  return (
    <div>
      <h1>회원가입 페이지</h1>
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
};

export default SignupPage;

