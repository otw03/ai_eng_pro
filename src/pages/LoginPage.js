import React from 'react';
import LoginForm from './LoginForm';
import FindIdPage from './FindIdPage';
import FindPasswordPage from './FindPasswordPage';
import PasswordResetCodePage from './PasswordResetCodePage';
import PasswordResetPage from './PasswordResetPage';

const LoginPage = () => {
  const handleLogin = () => {
    // 로그인 처리 로직
    console.log('로그인');
  };

  const handleSignup = () => {
    // 회원가입 페이지로 이동 등 처리
    console.log('회원가입');
  };

  const handleForgotId = () => {
    // 아이디 찾기 페이지로 이동 등 처리
    console.log('아이디/비밀번호 찾기');
  };

  const handleForgotPw = () => {
    // 비밀번호 찾기 페이지로 이동 등 처리
    console.log('아이디/비밀번호 찾기');
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 처리 로직
    console.log('카카오 로그인');
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <LoginForm onLogin={handleLogin} onSignup={handleSignup} onForgotId={handleForgotId} onForgotPw={handleForgotPw} onKakaoLogin={handleKakaoLogin} />
      {/* 아이디 찾기 페이지 */}
      <FindIdPage />
      {/* 비밀번호 찾기 페이지 */}
      <FindPasswordPage />
      {/* 비밀번호 인증 코드 입력 페이지 */}
      <PasswordResetCodePage />
      {/* 비밀번호 재설정 페이지 */}
      <PasswordResetPage />
    </div>
  );
};

export default LoginPage;

