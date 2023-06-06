const express = require("express");
const passport = require("passport");

const router = express.Router();

// Kakao 로그인 라우트
router.get(
  "/kakao",
  passport.authenticate("kakao")
);

// Kakao 로그인 후 처리할 콜백 라우트
router.get('/kakao/', passport.authenticate('kakao', {
  successRedirect: '/', // 로그인 성공 시 리다이렉트할 경로
  failureRedirect: '/' // 로그인 실패 시 리다이렉트할 경로
}));

module.exports = router;
