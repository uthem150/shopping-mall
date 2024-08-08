const express = require("express");
const router = express.Router();
const { Product } = require("../models/Product");
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
  // client부터 이미지 받은 것을 저장
  upload(req, res, (err) => {
    if (err) return res.json({ success: false, err });
    return res.json({
      success: true,
      image: res.req.file.path, //업로드된 파일 경로
      fileName: res.req.file.filename,
    });
  });
});

//상품을 DB에 저장하는 API 엔드포인트
router.post("/uploadProduct", auth, async (req, res) => {
  // client로 부터 받은 데이터로 인스턴스 생성
  const product = new Product(req.body);

  try {
    await product.save();
    return res.status(200).json({ success: true }); // 저장 성공 시
  } catch (err) {
    return res.status(400).json({ success: false, err }); // 오류 발생 시
  }
});

router.post("/getProducts", auth, async (req, res) => {
  // 요청 본문에서 데이터 추출 및 기본값 설정
  let order = req.body.order ? req.body.order : "desc"; // 기본은 내림차순
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id"; // 기본은 id기준 정렬
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip); // 결과 건너뛰는 데 사용

  try {
    const products = await Product.find() //Product 모델 사용하여 DB에서 제품 목록 조회
      .populate("writer") //writer 필드가 User 모델과 관련이 있는 경우, writer 필드의 상세 정보를 포함하도록
      .sort([[sortBy, order]]) //sortBy와 order 변수를 사용하여 정렬
      .skip(skip) //skip 개수를 건너뛰도록
      .limit(limit) //결과의 최대 개수를 limit으로 제한
      .exec(); //쿼리 실행하고 결과 반환
    return res
      .status(200)
      .json({ success: true, products, postSize: products.length }); // 저장 성공 시
  } catch (err) {
    return res.status(400).json({ success: false, err }); // 오류 발생 시
  }
});

module.exports = router;
