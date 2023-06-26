import React from "react";
import SignupForm from "../../components/SignupForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {

  return (
    <div>
      <h1>회원가입 페이지</h1>
      <SignupForm />
    </div>
  );
};

export default SignupPage;
