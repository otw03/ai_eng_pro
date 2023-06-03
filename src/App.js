/** import */
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
// import store from './store';

import LoginPage from "./pages/LoginPage";
import SignUpPage from './pages/SignUpPage';

import Main from './pages/Main';

import Button from './components/Button';
import InputForm from './components/InputForm';


function App() {
  return (
    // <Provider store={store}>
      <div>
        <LoginPage />
        <SignUpPage />
        <InputForm />
        <Button />
        <Main />
      </div>
    // </Provider>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import Main from './pages/Main';
// import LoginPage from './pages/LoginPage';
// import SignUpPage from './pages/SignUpPage';

// import FindIdPage from './pages/FindIdPage';
// import FindPasswordPage from './pages/FindPasswordPage';
// import PasswordResetCodePage from './pages/PasswordResetCodePage';
// import PasswordResetPage from './pages/PasswordResetPage';

// const App = () => (
//   <Router>
//     <Routes>
//       <Route path="/" element={<Main />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/signup" element={<SignUpPage />} />
//       {/* 찾기 페이지 추가 */}
//       <Route path="/find-id" element={<FindIdPage />} />
//       <Route path="/find-password" element={<FindPasswordPage />} />
//       <Route path="/password-reset-code" element={<PasswordResetCodePage />} />
//       <Route path="/password-reset" element={<PasswordResetPage />} />
//       {/* 기타 추가 페이지 위치*/}
//     </Routes>
//   </Router>
// );

// export default App;
