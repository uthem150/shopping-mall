const { User } = require("../models/User");

//사용자의 요청이 인증된 사용자에 의해 이루어졌는지 확인
//req (요청 객체), res (응답 객체), next (다음 미들웨어를 호출하는 함수)
let auth = (req, res, next) => {
  //client 쿠키에서 x_auth라는 변수명으로 넣었던 토큰 가져옴
  let token = req.cookies.w_auth;

  if (!token) {
    return res
      .status(401)
      .json({ isAuth: false, message: "Authentication token not found" });
  }

  //User 모델의 findByToken 메서드 통해, DB에서 토큰에 해당하는 사용자 찾음
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      });

    req.token = token; //요청 객체 (req)에 token 속성을 추가하여, 추출한 토큰 저장
    req.user = user; //요청 객체 (req)에 user 속성을 추가하여, 찾은 사용자 정보 저장
    next(); //다음 미들웨어로 이동
  });
};

module.exports = { auth };
