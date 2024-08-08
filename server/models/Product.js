const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId, //상품의 작성자 참조
      ref: "User",
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    continents: {
      type: Number,
      default: 1,
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } //자동으로 createdAt과 updatedAt 필드 추가
);

// MongoDB에서 효율적인 검색 위해 인덱스 생성
productSchema.index(
  // 아래 두 필드 텍스트 검색 인덱스로 설정
  {
    title: "text",
    description: "text",
  },
  // 필드의 검색 가중치 설정
  // title은 검색 결과에서 더 높은 우선순위
  {
    weights: {
      name: 5,
      description: 1,
    },
  }
);

// productSchema에 기반한 Product 모델 생성
const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
