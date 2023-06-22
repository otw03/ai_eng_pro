// const fs = require("fs");
// const { join, resolve } = require("path");

// const express = require('express');
// const passport = require('passport');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const path = require('path');
// const dotenv = require("dotenv");
// const authRoutes = require("./routes/auth");

// const app = express();
// require('dotenv').config();
// require('./config/passport-setup');

// // app.use(passport.session());

// app.use(cors());
// app.use(cookieParser());
// app.use(passport.initialize());
// app.use(express.json());

// app.use(express.static(path.join(__dirname, 'build')));

// (async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// })();

// app.use(passport.initialize());

// app.get('/', (req, res)=>{
//   res.send("hello")
// })

// app.use("/auth", authRoutes);

// app.use('/auth/kakao', authRoutes);

// // 모든 요청 처리
// app.get('*', (req, res) => {
//   console.log(res.sendFile(path.join(__dirname, 'build', 'index.html')));
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const mongoose = require("mongoose");
const User = require("./models/User");
const Message = require('./models/Message');

const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const nodemailer = require('nodemailer'); // 메일발송 --> app.use()로 추가설정 필요 없음.

const openai = require('openai');

const app = express();
app.use(cors());
dotenv.config();
const router = express.Router();

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express 세션 및 Passport 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET, // 암호화 시 사용할 비밀 키
    resave: false, // 요청이 전달되면, 강제로 세션을 다시 저장할지 여부
    saveUninitialized: true, // 초기화되지 않은 세션을 강제로 저장지 여부
    cookie: {
      secure: false, // HTTPS 환경에서만 사용할지 여부
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport 전략 설정
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 데이터베이스 연결
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

// kakao login
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_APP_KEY,
      clientSecret: "", // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
      callbackURL: "http://localhost:8080/oauth",
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

// 회원가입
app.post("/signup", async (req, res, next) => {
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


// 로컬 전략 설정
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      // console.log(username, password);
      try {
        const user = await User.findOne({username:username});
        console.log(user);
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

passport.serializeUser((user, done) => {
  console.log(`
  ==================================
  user: ${user}
  ==================================
  `);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(id);
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


// 라우터 설정
// 로그인 라우터 구현
app.post("/login", (req, res, next) => {
  console.log(req.body);
  passport.authenticate('local', (err, user, info) => {
    console.log(user);
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

// 로그아웃 기능을 구현하는 라우터
app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).send('Logout error');
    } else {
      res.redirect('/'); // 리다이렉트할 경로를 선택하십시오.
    }
  });
});

app.get("/auth/kakao", passport.authenticate("kakao"), function (req, res) {
  // 로그인 시작시 state 값을 받을 수 있음
  res.send(
    `id : ${req.user.profile.id} / accessToken : ${req.user.accessToken} `
  );
});

app.get('/kakao', passport.authenticate('kakao', {
  failureRedirect: '/', // 실패했을 경우 리다이렉트 경로
})

);

app.get('/oauth', passport.authenticate('kakao', {
  failureRedirect: '/?error=카카오로그인 실패',
}), 
  (req, res) => {
    res.redirect('http://localhost:8081/main'); // 다 완료되면 리다이렉트 URL
  }
);

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

async function sendUserIdEmail(email, username) {
  const subject = "아이디 찾기 결과";
  // const url = `https://localhost:8081`
  const text = `사용자 아이디: ${username}`;
  await sendEmail(email, subject, text);
}

// 아이디(username) 찾기 라우터 구현
app.post("/find-id", async(req, res) => {
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

// 인증 코드 생성 및 유효 기간 설정
function createVerificationCode() {
  const code = crypto.randomBytes(16).toString("hex");
  const expiresIn = Date.now() + 300000; // 5분 후 유효기간 만료
  return { code, expiresIn };
}

// 이메일로 인증 코드 발송
async function sendVerificationCodeEmail(email, code) {
  const subject = "비밀번호 재설정 인증 코드";
  const text = `인증 코드: ${code}`;
  await sendEmail(email, subject, text);
}


// OpenAI API
app.post('/chat', async (req, res) => {

  const userMessage = req.body.message;
  console.log(userMessage);

  // OpenAI API 호출
  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      
    });
    console.log(completion.data.choices[0].message);

    res.json({ message: completion.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// 비밀번호 찾기 - 인증 코드 발송 라우터 구현
app.post("/find-password", async (req, res) => {
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

// 비밀번호 찾기 - 인증 코드 확인 라우터 구현
app.post("/find-password/reset-code", async (req, res) => {
  console.log(req.body.verificationCode);
  const { verificationCode } = req.body;
  const user = await User.findOne({ veriCode: verificationCode });
  console.log(user.veriCodeExpiresIn);

  if (!user || user.veriCodeExpiresIn < new Date()) {
    return res.status(400).json({ message: "잘못된 인증 코드 또는 인증 코드가 만료되었습니다." });
  }

  res.status(200).json({ username: user.username, message: "인증 코드 확인 성공" });
});

// 비밀번호 찾기 - 재설정 라우터 구현
app.post("/find-password/reset-code/reset-password", async (req, res) => {
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
