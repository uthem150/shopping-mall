import { RocketOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ImageSlider from "../../utils/ImageSlider";
import styled from "styled-components";
import CheckBox from "./Sections/CheckBox";
import RadioBox from "./Sections/RadioBox";
import { continents, price } from "./Sections/Datas";
import SearchFeature from "./Sections/SearchFeature";

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
  const [searchTerms, setSearchTerms] = useState("");

  //필터링 항목에 대한 정보
  const [Filters, setFilters] = useState({
    continents: [],
    price: [],
  });

  //서버에서 제품 데이터 비동기적으로 가져오는 함수
  const getProducts = async (variables) => {
    try {
      // variables에 서버로 전송할 데이터 함께 보냄
      const response = await axios.post("/api/product/getProducts", variables);

      if (response.data.success) {
        // variables.loadMore를 눌러서 온 경우
        if (variables.loadMore) {
          //응답 받으면, 현재 products 상태 업데이트
          setProducts((prevProducts) => [
            ...prevProducts, //기존의 제품 배열 그대로 유지
            ...response.data.products, //서버에서 가져온 새로운 제품 배열을 기존 배열에 추가
          ]);
          console.log(response.data.products);
        } else {
          // loadMore 버튼을 누른게 아닌, 필터링 바꿀 때
          setProducts(response.data.products);
        }
        setPostSize(response.data.postSize);
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
      loadMore: true,
    };
    getProducts(variables);
    setSkip(skip);
  };

  // 필터링된 결과 보여주기 위해 서버에 요청을 보내는 함수
  const showFilteredResults = (filters) => {
    const variables = {
      skip: 0,
      limit: Limit,
      filters: filters, //현재 선택된 필터 포함하는 객체
    };
    getProducts(variables);
    setSkip(0);
  };

  // 주어진 필터에 따라, 적절한 가격 범위 배열을 반환
  const handlePrice = (value) => {
    const data = price; // price 객체 참조
    let array = []; // 결과로 반환할 가격 범위 배열

    for (let key in data) {
      // data의 각 항목에서 _id 속성이 주어진 value와 일치하는지 확인
      // value를 정수로 변환 (10진법)
      if (data[key]._id === parseInt(value, 10)) {
        //_id가 일치하는 항목의 array 속성을 array 변수에 할당
        array = data[key].array;
      }
    }
    console.log("array", array);
    return array;
  };

  // 필터가 적용된 새로운 상태 업데이트
  const handleFilters = (filters, category) => {
    //현재 Filters를 복사하여, 새로운 객체 newFilters 생성(대륙, 가격 항목)
    const newFilters = { ...Filters };

    //category에 해당하는 필터 값 filters로 업데이트
    //category가 "price"라면, newFilters["price"]에 filters 값 설정
    newFilters[category] = filters;

    if (category === "price") {
      //filters 값을 인자로 전달하여, 가격 필터에 해당하는 가격 범위 배열을 반환받음
      let priceValues = handlePrice(filters);
      //반환된 priceValues 배열을 newFilters의 price 속성에 설정
      newFilters[category] = priceValues;
    }

    console.log(newFilters);

    showFilteredResults(newFilters);
    setFilters(newFilters);
  };

  // SearchFeature에서 받은 내용으로 update
  const updateSearchTerms = (newSearchTerm) => {
    setSearchTerms(newSearchTerm);

    const variables = {
      skip: 0,
      limit: Limit,
      filters: Filters,
      searchTerm: newSearchTerm,
    };

    setSkip(0); //검색을 하면, 처음부터 다시 받아와야 하므로
    setSearchTerms(newSearchTerm);
    getProducts(variables);
  };

  const renderCards = products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={12}>
        <CustomCard
          key={product._id}
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

      {/* Filter  */}
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <CheckBox
            list={continents}
            //체크박스에서 사용자가 선택한 항목들을 filters로 받아, handleFilters라는 다른 함수에 두 개의 인자 전달
            handleFilters={(filters) => handleFilters(filters, "continents")}
          />
        </Col>
        <Col lg={12} xs={24}>
          <RadioBox
            list={price}
            handleFilters={(filters) => handleFilters(filters, "price")}
          />
        </Col>
      </Row>

      {/* Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerms} />
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
