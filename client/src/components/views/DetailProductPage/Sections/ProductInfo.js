import React, { useEffect, useState } from "react";
import { Button, Descriptions } from "antd";

function ProductInfo(props) {
  const [Product, setProduct] = useState({}); //제품 정보 저장

  //props.detail로부터 받은 제품 정보를 Product 상태에 설정
  useEffect(() => {
    setProduct(props.detail);
  }, [props.detail]);

  const addToCartHandler = () => {
    props.addToCart(props.detail._id);
  };

  return (
    <div>
      <Descriptions title="Product Info">
        <Descriptions.Item label="Price"> {Product.price}</Descriptions.Item>
        <Descriptions.Item label="Sold">{Product.sold}</Descriptions.Item>
        <Descriptions.Item label="View"> {Product.views}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {Product.description}
        </Descriptions.Item>
      </Descriptions>

      <br />
      <br />
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={addToCartHandler}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductInfo;
