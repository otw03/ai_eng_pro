const express = require('express');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose
  .connect(MONGO_URI, {  })