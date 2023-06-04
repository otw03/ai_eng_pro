import React from 'react';
import LoginForm from '../../components/LoginForm';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 로그인 처리 로직
    console.log('로그인');
    navigate("/main");
  };

  const handleSignup = () => {
    // 회원가입 페이지로 이동 등 처리
    console.log('회원가입');
    navigate("/signup");
  };

  const handleForgotId = () => {
    // 아이디 찾기 페이지로 이동 등 처리
    console.log('아이디 찾기');
    navigate("/find-id");
  };

  const handleForgotPw = () => {
    // 비밀번호 찾기 페이지로 이동 등 처리
    console.log('비밀번호 찾기');
    navigate("/find-password");
  };

  const handleKakaoLogin = async () => {
    // 카카오 로그인 처리 로직
    console.log('카카오 로그인');
    
    try {
      const response = await axios.get('auth/kakao');
      window.location.href = response.data.redirectUri;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <LoginForm onLogin={handleLogin} onSignup={handleSignup} onForgotId={handleForgotId} onForgotPw={handleForgotPw} onKakaoLogin={handleKakaoLogin} />
    </div>
  );
};

export default LoginPage;

