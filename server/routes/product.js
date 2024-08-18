const express = require("express");
const router = express.Router();
const { Product } = require("../models/Product");
const multer = require("multer"); // 파일 업로드 처리하기 위한 미들웨어
const { auth } = require("../middleware/auth"); // 사용자 인증을 처리하는 미들웨어

const fs = require("fs"); // 파일 시스템 모듈
const path = require("path"); // 경로 처리 모듈

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

// 상품 삭제 엔드포인트 (auth 미들웨어로 인증된 사용자만 접근 가능)
router.delete("/deleteProduct/:id", auth, async (req, res) => {
  const productId = req.params.id; // URL 파라미터에서 상품 ID 가져옴
  const userId = req.user._id; // auth 미들웨어를 통해 인증된 사용자 ID 가져옴

  try {
    // 해당 ID의 상품 데이터베이스에서 조회
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 상품 작성자와 현재 사용자가 같은지 확인
    if (product.writer.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own products",
      });
    }

    // 이미지 파일 삭제
    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        // __dirname이 server 폴더 내부를 가리키므로, ".."를 사용하지 않고 상대 경로를 직접 지정
        const imagePath = path.join(
          process.cwd(),
          "uploads",
          path.basename(image)
        );
        console.log("Deleting file:", imagePath); // 디버깅용 로그
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete the image file:", err);
          } else {
            console.log("Successfully deleted the image file:", imagePath);
          }
        });
      });
    }

    // 상품을 삭제
    await Product.findByIdAndDelete(productId);

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
});

router.post("/getProducts", async (req, res) => {
  // 요청 본문에서 데이터 추출 및 기본값 설정
  let order = req.body.order ? req.body.order : "desc"; // 기본은 내림차순
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id"; // 기본은 id기준 정렬
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip); // 결과 건너뛰는 데 사용

  // 데이터베이스 쿼리에 사용할 필터 조건 정의
  let findArgs = {};
  let term = req.body.searchTerm;

  //루프 돌면서, 클라이언트가 요청한 각 필터 조건을 확인
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      // 가격 필드 조건이 있을 때
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0], //크거나 같음
          $lte: req.body.filters[key][1], //작거나 같음
        };
      } else {
        // 다른 필터 조건의 경우 해당 필드 그대로 findArgs 객체에 추가
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    // 검색을 한 경우
    try {
      const products = await Product.find(findArgs)
        .find({
          //텍스트 검색 수행하는 MongoDB의 기능 사용 (term에 해당하는 검색어와 일치하는 모든 텍스트 필드 검색)
          $or: [
            { title: { $regex: term, $options: "i" } }, // 대소문자 구분 없이 title에서 부분 일치 검색
            { description: { $regex: term, $options: "i" } }, // 대소문자 구분 없이 description에서 부분 일치 검색
          ],
        })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec();
      return res
        .status(200)
        .json({ success: true, products, postSize: products.length }); // 저장 성공 시
    } catch (err) {
      return res.status(400).json({ success: false, err }); // 오류 발생 시
    }
  } else {
    // 검색을 한게 아닐 경우
    try {
      const products = await Product.find(findArgs) //Product 모델 사용하여 DB에서 제품 목록 조회
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
  }
});

//?id=${productId}&type=single
//id=12121212,121212,1212121   type=array
router.get("/products_by_id", async (req, res) => {
  //req.body랑 다르게, url 쿼리 문자열에서 데이터 가져옴
  let type = req.query.type;
  let productIds = req.query.id; // 요청 URL의 쿼리 문자열에서 id 파라미터를 추출

  if (type === "array") {
    let ids = req.query.id.split(",");
    productIds = [];

    // ids 배열의 각 요소를 변환하여 productIds 배열에 할당
    productIds = ids.map((item) => {
      return item;
    });
  }

  //product Id에 해당되는 데이터 가져옴
  try {
    // Product 모델을 사용해서 DB에서 조건에 맞는 제품 찾음
    const products = await Product.find({ _id: { $in: productIds } })
      .populate("writer") //Product 모델의 writer 필드에 대한 참조
      .exec();

    // 데이터 조회에 성공했을 경우, 200 상태 코드와 함께 제품 데이터 응답으로 반환
    return res.status(200).send(products);
  } catch (err) {
    // 데이터 조회 중 오류가 발생했을 경우, 400 상태 코드와 함께 오류 메시지 반환
    return res.status(400).json({ success: false, err });
  }
});

module.exports = router;
