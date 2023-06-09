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

const express = require('express')
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const KakaoStrategy = require('passport-kakao').Strategy
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User');

const { check, validationResult } = require("express-validator");

const app = express()
app.use(cors());
require('dotenv').config();
const router = express.Router();


(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET, // 암호화 시 사용할 비밀 키
  resave: false, // 요청이 전달되면, 강제로 세션을 다시 저장할지 여부
  saveUninitialized: true, // 초기화되지 않은 세션을 강제로 저장지 여부
  cookie: {
    secure: false // HTTPS 환경에서만 사용할지 여부
  },
}));


app.use(passport.initialize());
app.use(passport.session());

// kakao login
passport.use(new KakaoStrategy({
        clientID : "KAKAO_APP_KEY",
        clientSecret: "", // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
        callbackURL : "http://localhost:8081/auth/kakao"
    },
    (accessToken, refreshToken, profile, done) => {
        // authorization 에 성공했을때의 액션
        console.log(`accessToken : ${accessToken}`)
        console.log(`사용자 profile: ${JSON.stringify(profile._json)}`)
        let user = {
            profile: profile._json,
            accessToken: accessToken
        }
        return done(null, user)
    }
))

// // 로컬 전략 설정
// passport.use(
//   new LocalStrategy({ 
//     usernameField: "username", 
//     passwordField: "password" }, async (username, password, done) => {
//     try {
//       const user = await User.findOne({ username: username });
//       // console.log(user);
//       if (!user) {
//         return done(null, false, { message: "잘못된 아이디 또는 비밀번호입니다." });
//       }

//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return done(null, false, { message: "잘못된 아이디 또는 비밀번호입니다." });
//       }

//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   })
// );


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});




// 회원가입
app.post("/signup", async (req, res) => {
  const { username, name, email, password, /* confirmPassword */ } = req.body;

  try {
    // 이메일과 비밀번호 기반으로 사용자 생성
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, name, email, password: hashedPassword, /* confirmPassword */ });
    User.register(newUser, hashedPassword, (err, user) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('User registered successfully');
    });
    await newUser.save();

    // 성공 응답 전송
    res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    // 오류 응답 전송
    res.status(500).json({ error });
  }
});

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// // 라우터 설정
// // 로그인 라우터 구현
// app.post('/login', (req, res, next) => { 
//   console.log(req.body);
//   passport.authenticate('local', (err, user, info) => {
//     console.log(user, info);
//     // 오류 처리
//     if (err) {
//       return next(err);
//     }

//     // 사용자가 없거나 인증 정보가 잘못된 경우
//     if (!user) {
//       return res.status(401).json({ message: info.message });
//     }

//     req.logIn(user, (err) => {
//       if (err) {
//         return next(err);
//       }

//       // 로그인 성공한 경우, 사용자 정보 반환
//       return res.status(200).json(user);
//     });

//   })(req, res, next);
// });

app.get('/auth/kakao', passport.authenticate('kakao'), function (req, res) {
    // 로그인 시작시 state 값을 받을 수 있음
    res.send(`id : ${req.user.profile.id} / accessToken : ${req.user.accessToken} `)
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})