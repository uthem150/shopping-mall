const express = require("express");
const router = express.Router();
const multer = require("multer"); // 파일 업로드 처리하기 위한 미들웨어
const { auth } = require("../middleware/auth"); // 사용자 인증을 처리하는 미들웨어

// multer 저장소 설정
var storage = multer.diskStorage({
  // 파일이 저장될 폴더 지정 (uploads폴더)
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // 저장될 파일 이름을 지정
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  // 파일 확장자 확인 (jpg나 png가 아니면 저장할 수 X)
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" || ext !== ".png") {
      return cb(res.status(400).end("only jpg, png are allowed"), false);
    }
    cb(null, true);
  },
});

// multer 미들웨어 설정
// 파일이 저장될 방식 정의한 storage 설정 객체 전달
// single 메서드는 하나의 파일만 업로드할 때 사용
var upload = multer({ storage: storage }).single("file");

//=================================
//             Product
//=================================

// 이미지 업로드 엔드포인트 (auth미들웨어로 인증된 사용자만 접근)
router.post("/uploadImage", auth, (req, res) => {
  // after getting that image from client
  // we need to save it inside Node Server
  // Multer library
  upload(req, res, (err) => {
    if (err) return res.json({ success: false, err });
    return res.json({
      success: true,
      image: res.req.file.path, //업로드된 파일 경로
      fileName: res.req.file.filename,
    });
  });
});

module.exports = router;
