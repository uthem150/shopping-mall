import { RocketOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ImageSlider from "../../utils/ImageSlider";
import styled from "styled-components";

//Card 컴포넌트 확장하여 커스터마이징
const CustomCard = styled(Card)`
  .ant-card-body {
    padding: 15px;
  }
`;

// 첫 페이지
function LandingPage() {
  const [products, setProducts] = useState([]); // 판매 목록
  const [Skip, setSkip] = useState(0); //페이지 시작점 나타냄
  const [Limit, setLimit] = useState(8); //한 페이지에서 로드할 제품 수 설정
  const [postSize, setPostSize] = useState(0); //전체 제품 수를 저장하는 상태

  //서버에서 제품 데이터 비동기적으로 가져오는 함수
  const getProducts = async (variables) => {
    try {
      // variables에 서버로 전송할 데이터 함께 보냄
      const response = await axios.post("/api/product/getProducts", variables);

      if (response.data.success) {
        //응답 받으면, 현재 products 상태 업데이트
        setProducts((prevProducts) => [
          ...prevProducts, //기존의 제품 배열 그대로 유지
          ...response.data.products, //서버에서 가져온 새로운 제품 배열을 기존 배열에 추가
        ]);
        setPostSize(response.data.postSize);
        console.log(response.data.products);
      } else {
        alert("Failed to fetch product data");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("An error occurred while fetching products");
    }
  };

  // 컴포넌트가 처음 렌더링될 때, products가져오기
  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: Limit,
    };
    getProducts(variables);
  }, []);

  // 더보기 버튼 클릭될 때
  const onLoadMore = () => {
    // 다음에 로드할 제품의 시작 위치 = 이전에 로드된 제품 수 + 한 번에 로드할 제품 수
    let skip = Skip + Limit;

    const variables = {
      skip: skip,
      limit: Limit,
    };
    getProducts(variables);
    setSkip(skip);
  };

  const renderCards = products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={12}>
        <CustomCard
          hoverable={true} // 마우스 오버 시 카드가 약간 확대되는 효과
          cover={
            <a href={`/product/${product._id}`}>
              <ImageSlider images={product.images} />
            </a>
          }
        >
          <Meta title={product.title} description={`$${product.price}`} />
        </CustomCard>
      </Col>
    );
  });

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travel Anywhere <RocketOutlined />{" "}
        </h2>
      </div>

      {/* 제품이 없을 때 */}
      {products.length === 0 ? (
        <div
          style={{
            display: "flex",
            height: "300px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>No post yet...</h2>
        </div>
      ) : (
        <div>
          {/* 각 카드 사이에 16px 간격 */}
          <Row gutter={[16, 16]}>{renderCards}</Row>
        </div>
      )}
      <br />
      <br />

      {postSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
