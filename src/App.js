// /** import */
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store";

// import LoginPage from "./pages/LoginPage";
// import SignUpPage from "./pages/SignUpPage";

// import Main from "./pages/main/Main";

// import Button from "./components/Button";
// import InputForm from "./components/InputForm";

// function App() {
//   return (
//     <Provider store={store}>
//       <div>
//         <LoginPage />
//         <SignUpPage />
//         <InputForm />
//         <Button />
//         <Main />
//       </div>
//     </Provider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import ChatRoom from './pages/chat/ChatRoom';
import FindIdPage from './pages/auth/FindIdPage';
import FindPasswordPage from './pages/auth/FindPasswordPage';
import LoginPage from './pages/auth/LoginPage';
import Main from './pages/main/Main';
// import NoteEditor from './pages/note/NoteEditor';
// import NoteList from './pages/note/NoteList';
// import NoteView from './pages/note/NoteView';
import PasswordResetCodePage from './pages/auth/PasswordResetCodePage';
import PasswordResetPage from './pages/auth/PasswordResetPage';
import SignUpPage from './pages/auth/SignUpPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* LoginPage를 메인 페이지로 설정 */}
        <Route path="/" element={<LoginPage />} />

        {/* 회원가입, 아이디 찾기, 비밀번호 찾기 라우팅 처리 */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/find-password" element={<FindPasswordPage />} />
        <Route path="/find-password/reset-code" element={<PasswordResetCodePage />} />
        <Route path="/find-password/reset-code/reset-password" element={<PasswordResetPage />} />
        
        {/* 로그인 후 Main 페이지 라우팅 처리 */}
        <Route path="/main/*" element={<Main />} />
        
        {/* <Route path="/chat" element={<ChatRoom />} />
        <Route path="/note" element={<NoteList />} /> */}
        {/* <Route path="/note/view/:noteId" element={<NoteView />} />
        <Route path="/note/edit/:noteId" element={<NoteEditor />} /> */}
      </Routes>
    </Router>
  );
}

export default App;



