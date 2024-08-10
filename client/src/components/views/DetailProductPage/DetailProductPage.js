import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "antd";
import ProductImage from "./Sections/ProductImage";
import ProductInfo from "./Sections/ProductInfo";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart } from "../../../_actions/user_actions";

function DetailProductPage() {
  const dispatch = useDispatch(); // Redux의 dispatch 함수
  const { productId } = useParams(); // URL 파라미터에서 가져온 제품 ID
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios
      //제품 ID를 쿼리 파라미터로 포함하여 요청 (단일 제품 정보 반환)
      .get(`/api/product/products_by_id?id=${productId}&type=single`)
      .then((response) => {
        setProduct(response.data[0]); //첫 번째 제품의 데이터를 setProduct로 설정
      });
  }, [productId]); //productId가 변경될 때마다 실행

  const addToCartHandler = (productId) => {
    dispatch(addToCart(productId));
  };

  return (
    <div className="postPage" style={{ width: "100%", padding: "3rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>{product.title}</h1>
      </div>

      <br />

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <ProductImage detail={product} />
        </Col>
        <Col lg={12} xs={24}>
          <ProductInfo addToCart={addToCartHandler} detail={product} />
        </Col>
      </Row>
    </div>
  );
}

export default DetailProductPage;
