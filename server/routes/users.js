const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

//사용자가 인증되었는지 확인하는 엔드포인트
router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//새로운 사용자 등록
//사용자 정보를 req.body로 받아와 새로운 User 인스턴스를 생성하고 저장
router.post("/register", async (req, res) => {
  const user = new User(req.body);

  try {
    const doc = await user.save();
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

//사용자가 로그인하는 엔드포인트
router.post("/login", async (req, res) => {
  try {
    //이메일로 사용자를 찾고, 해당 이메일이 없는 경우 에러 메시지 반환
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });
    }

    //비밀번호 일치하지 않으면
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.json({ loginSuccess: false, message: "Wrong password" });
    }

    const updatedUser = await user.generateToken(); //사용자에 대한 인증 토큰을 생성
    res.cookie("w_authExp", updatedUser.tokenExp); //토큰 만료 시간을 쿠키에 설정
    res
      .cookie("w_auth", updatedUser.token) //w_auth을 이름으로, 인증 토큰을 쿠키에 설정
      .status(200)
      .json({ loginSuccess: true, userId: updatedUser._id });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// 로그아웃 엔드포인트
// auth로 중간에 사용자가 인증되었는지 확인해야 다음으로 넘어감
router.get("/logout", auth, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { token: "", tokenExp: "" }
    );
    return res.status(200).send({
      success: true,
    });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

module.exports = router;
