const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: "KAKAO_APP_KEY",
        callbackURL: "http://localhost:8080/auth/kakao",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          // 사용자 데이터베이스에서 기존 사용자를 찾거나 새 사용자를 작성하세요
          const user = {
            id: profile.id,
            userName: profile.username,
          }; // 기존 사용자 가져오거나 새로 작성
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};