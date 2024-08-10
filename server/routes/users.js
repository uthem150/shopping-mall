const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

//사용자가 인증되었는지 확인하는 엔드포인트
router.get("/auth", auth, (req, res) => {
  console.log("Auth route called"); // 추가된 로그

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

router.post("/update", async (req, res) => {
  const { _id, name, image, password, currentPassword } = req.body;

  try {
    // 사용자를 찾습니다.
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ success: false, err: "User not found" });
    }

    // 비밀번호 변경을 시도하는 경우 현재 비밀번호를 확인합니다.
    if (password) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ success: false, err: "Current password is required" });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, err: "Current password is incorrect" });
      } else {
        user.password = password;
      }
    }

    if (name) user.name = name;
    if (image) user.image = image;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
});

// 장바구니 추가
router.post("/addToCart", auth, async (req, res) => {
  try {
    const userInfo = await User.findById(req.user._id); // 유저 로그인 확인

    // 존재하는 유저인지 확인
    if (!userInfo) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // some메소드 통해, product가 이미 존재하는지 확인
    const duplicate = userInfo.cart.some(
      (cartInfo) => cartInfo.id === req.query.productId
    );

    if (duplicate) {
      // 중복된 상품 있는 경우
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: req.user._id, //id로 해당 사용자 찾음
          "cart.id": req.query.productId, //사용자의 cart배열에서 productId를 가진 상품을 찾음
        },
        { $inc: { "cart.$.quantity": 1 } }, //cart 배열에서, 해당 productId 가진 항목 quantity 1 증가
        { new: true } //업데이트된 후의 사용자 정보 반환
      );

      // 업데이트 실패할 경우
      if (!updatedUser) {
        return res
          .status(400)
          .json({ success: false, message: "Update failed" });
      }

      // 갱신된 장바구니 정보 클라이언트에 반환
      return res.status(200).json(updatedUser.cart);
    } else {
      // 새로운 상품일 경우
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id }, //id로 해당 사용자 찾음
        {
          // push연산자로, 중복된 상품이 없으면, cart 배열에 새 상품을 추가
          $push: {
            cart: {
              id: req.query.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(400)
          .json({ success: false, message: "Update failed" });
      }

      return res.status(200).json(updatedUser.cart);
    }
  } catch (err) {
    return res.status(500).json({ success: false, err });
  }
});

module.exports = router;
