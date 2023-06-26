const express = require('express');
const dotenv = require("dotenv");
const router = express.Router();
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/User');
const bcrypt = require("bcrypt");

dotenv.config();
// Passport strategies, serialize/deserialize
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// kakao login 전략
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_APP_KEY,
      clientSecret: "", // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
      callbackURL: "http://localhost:8080/auth/oauth",
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log("kakao profile", profile);
      try {
        const exUser = await User.findOne({
          snsId: profile.id, provider: "kakao",
        });
        if (exUser) {
          done(null, exUser);
        } else {
          const newUser = await User.create({
            email: profile._json?.kakao_account?.email,
            name: profile.username,
            snsId: profile.id,
            provider: "kakao",
          });
          done(null, newUser);
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

// 로컬 전략 설정
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      console.log(username, password);
      try {
        const user = await User.findOne({username:username});
        // console.log(user);
        if (!user) {
          return done(null, false, {
            message: "잘못된 아이디 또는 비밀번호입니다.",
          });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        // console.log(isPasswordValid);
        if (!isPasswordValid) {
          return done(null, false, {
            message: "잘못된 아이디 또는 비밀번호입니다.",
          });
        }

        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  )
);

// 회원가입
router.post("/signup", async (req, res, next) => {
  const { username, name, email, password /* confirmPassword */ } = req.body;

  try {
    // 사용자 이름 중복 확인
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // 이미 등록된 사용자 이름이 존재하는 경우, 오류 응답 전송
      return res.status(409).json({
        message: "이미 등록된 사용자 이름이 있습니다. 다른 사용자 이름을 선택해주세요.",
      });
    }

    // 이메일과 비밀번호 기반으로 사용자 생성
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword /* confirmPassword */,
    });
    User.register(newUser, hashedPassword, (err, user) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("User registered successfully");
    });

    // 성공 응답 전송
    res.status(201).json({ message: "회원가입이 완료되었습니다." });
    next();
  } catch (error) {
    // 오류 응답 전송
    res.status(500).json({ error });
  }
});


passport.serializeUser((user, done) => {
  console.log(`
  ==================================
  user: ${user}
  ==================================
  `);
  done(null, user.id);
});

// passport.deserializeUser((id, done) => {
//   console.log(id);
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// 로그인
router.post("/login", (req, res, next) => {
  console.log(req.body);
  passport.authenticate('local', (err, user, info) => {
    console.log(user, info);
    // 오류 처리
    if (err) {
      return next(err);
    }

    // 사용자가 없거나 인증 정보가 잘못된 경우
    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    return req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      // 로그인 성공한 경우, 사용자 정보 반환
      return res.redirect('/');
    });
  })(req, res, next);
});

// 로그아웃
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).send('Logout error');
    } else {
      res.redirect('/'); // 리다이렉트할 경로를 선택하십시오.
    }
  });
});

// 카카오 로그인
router.get("/auth/kakao", passport.authenticate("kakao"), function (req, res) {
  // 로그인 시작시 state 값을 받을 수 있음
  res.send(
    `id : ${req.user.profile.id} / accessToken : ${req.user.accessToken} `
  );
});

router.get('/kakao', passport.authenticate('kakao', {
  failureRedirect: '/', // 실패했을 경우 리다이렉트 경로
}));

router.get('/oauth', passport.authenticate('kakao', {
  failureRedirect: '/?error=카카오로그인 실패',
}), 
  (req, res) => {
    res.redirect('http://localhost:8081/main'); // 다 완료되면 리다이렉트 URL
  }
);

module.exports = router;
