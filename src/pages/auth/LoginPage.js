import React, { useState } from "react";
import LoginForm from "../../components/LoginForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import bcrypt from "bcrypt";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("유저id: ", username);
    console.log("비밀번호: ", password);

    try {
      const response = await axios.post('/login', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        console.log("로그인 성공");
        navigate("/main");
      } else {
        console.log("로그인 실패");
      }
    } catch (error) {
      console.error("로그인 요청 중 오류가 발생했습니다.", error);

      if (error.response) {
        // 서버로부터 응답이 있는 경우
        if (error.response.status === 401) {
          console.error("로그인 실패: 잘못된 사용자 이름 또는 비밀번호입니다.");
        } else {
          console.error(
            `서버에서 오류가 발생했습니다. (HTTP 상태 코드: ${error.response.status})`
          );
        }
      } else {
        // 서버로부터 응답이 없는 경우
        console.error("서버와 통신하는 데 문제가 발생했습니다.");
      }
    }
  };

  const handleSignup = () => {
    // 회원가입 페이지로 이동 등 처리
    console.log("회원가입");
    navigate("/signup");
  };

  const handleForgotId = () => {
    // 아이디 찾기 페이지로 이동 등 처리
    console.log("아이디 찾기");
    navigate("/find-id");
  };

  const handleForgotPw = () => {
    // 비밀번호 찾기 페이지로 이동 등 처리
    console.log("비밀번호 찾기");
    navigate("/find-password");
  };

  const handleKakaoLogin = async () => {
    // 카카오 로그인 처리 로직
    // try {
    //   const res = await axios.get("http://localhost:8080/");
    //   console.log(res);
    // } catch (error) {
    //   console.error(error);
    // }
    window.location.href = "http://localhost:8080/kakao";
    console.log("카카오 로그인");
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onForgotId={handleForgotId}
        onForgotPw={handleForgotPw}
        onKakaoLogin={handleKakaoLogin}
      />
    </div>
  );
};

export default LoginPage;
