import React from 'react';
import SignupForm from './SignupForm';

const SignupPage = () => {
  const handleSignup = () => {
    // 회원가입 처리 로직
    console.log('회원가입');
  };

  return (
    <div>
      <h1>회원가입 페이지</h1>
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
};

export default SignupPage;

