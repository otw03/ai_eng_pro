const fs = require("fs");
const { join, resolve } = require("path");

const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

const app = express();
require('dotenv').config();
require('./config/passport-setup');
app.use(passport.initialize()); 
// app.use(passport.session());

app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

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

app.get('/', (req, res)=>{
  res.send("hello")
})

app.use("/auth", authRoutes);

// app.use('/auth/kakao', authRoutes);

// 모든 요청 처리
app.get('*', (req, res) => {
  console.log(res.sendFile(path.join(__dirname, 'build', 'index.html')));
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
