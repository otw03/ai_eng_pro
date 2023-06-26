const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

dotenv.config();

// 이메일 발송 설정
// 메일 서버 연동 정보 구성 
const configInfo = {
  host: process.env.SMTP_HOST, // SMTP 서버명 : smtp.gamil.com
  port: process.env.SMTP_PORT, // SMTP 포트 : 465
  secure: true, // 보안연결(SSL) 필요
  auth: {
      user: process.env.SMTP_USERNAME, // Gmail 로그인에 사용하는 메일 주소
      pass: process.env.SMTP_PASSWORD, // 앱 비밀번호
  },
};

// 발송에 필요한 서버 정보를 사용하여 발송객체 생성
const transporter = nodemailer.createTransport(configInfo);

// 이메일 발송 함수
async function sendEmail(to, subject, text) {
  // 이메일 옵션 설정
  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to,
    subject,
    text,
  };
  // 이메일 발송
  await transporter.sendMail(mailOptions);
}

// 아이디 찾기 이메일 발송 함수
async function sendUserIdEmail(email, username) {
  const subject = "아이디 찾기 결과";
  // const url = `https://localhost:8081`
  const text = `사용자 아이디: ${username}`;
  await sendEmail(email, subject, text);
}

// 인증 코드 생성 및 유효 기간 설정 함수
function createVerificationCode() {
  const code = crypto.randomBytes(16).toString("hex");
  const expiresIn = Date.now() + 300000; // 5분 후 유효기간 만료
  return { code, expiresIn };
}

// 이메일로 인증 코드 발송 함수
async function sendVerificationCodeEmail(email, code) {
  const subject = "비밀번호 재설정 인증 코드";
  const text = `인증 코드: ${code}`;
  await sendEmail(email, subject, text);
}

/* 라우터 구현 */
// 아이디(username) 찾기
router.post("/find-id", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "등록된 이메일이 없습니다." });
    }
    // 아이디 이메일 전송 로직
    await sendUserIdEmail(user.email, user.username);

    res.status(200).json({ message: "아이디가 이메일로 전송되었습니다." });
  } catch (err) {
    res.status(500).json({err});
  }
});

// 비밀번호 찾기 - 인증 코드 발송
router.post("/find-password", async (req, res) => {
  try {
    console.log(req.body.username, req.body.email);
    const user = await User.findOne({ username: req.body.username, email: req.body.email });
    // console.log(user);

    if (!user) {
      return res.status(400).json({ message: "등록된 아이디 또는 이메일이 없습니다." });
    }

    const { code, expiresIn } = createVerificationCode();
    console.log(code, expiresIn);
    // User 스키마 업데이트
    await User.findByIdAndUpdate(user._id, { veriCode: code, veriCodeExpiresIn: expiresIn });
    // console.log(user);

    // 인증코드 메일 발송
    await sendVerificationCodeEmail(req.body.email, code);
    res.status(200).json({ message: "인증 코드가 이메일로 발송되었습니다." });
  } catch (err) {
    res.status(500).json({err});
  }
});

// 비밀번호 찾기 - 인증 코드 확인
router.post("/find-password/reset-code", async (req, res) => {
  console.log(req.body.verificationCode);
  const { verificationCode } = req.body;
  const user = await User.findOne({ veriCode: verificationCode });
  console.log(user.veriCodeExpiresIn);

  if (!user || user.veriCodeExpiresIn < new Date()) {
    return res.status(400).json({ message: "잘못된 인증 코드 또는 인증 코드가 만료되었습니다." });
  }

  res.status(200).json({ username: user.username, message: "인증 코드 확인 성공" });
});

// 비밀번호 찾기 - 재설정
router.post("/find-password/reset-code/reset-password", async (req, res) => {
  const { userName, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { username: userName },
      { password: hashedPassword }
    );
    res.status(200).json({ message: "비밀번호 재설정 성공" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
