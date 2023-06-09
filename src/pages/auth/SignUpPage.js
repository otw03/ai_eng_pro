import React from "react";
import SignupForm from "../../components/SignupForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = async () => {
    // 회원가입 처리 로직
    const data = {
      username: "otw03",
      password: "1234",
      email: "otw03@naver.com",
    };

    console.log(data);
      
    try {
      const response = await axios.post("http://localhost:8080/signup", data);
      console.log(response.data);
      console.log(response.data.message);
      navigate("/login");
    } catch (error) {
      console.error(error.response.data);
    }
  }

  return (
    <div>
      <h1>회원가입 페이지</h1>
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
};

export default SignupPage;
