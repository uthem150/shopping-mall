import { Button, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import FileUpload from "../../utils/FileUpload";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;

// 대륙 설정 목록
const Continent = [
  { key: 1, value: "Africa" },
  { key: 2, value: "Europe" },
  { key: 3, value: "Asia" },
  { key: 4, value: "North America" },
  { key: 5, value: "South America" },
  { key: 6, value: "Australia" },
  { key: 7, value: "Antarctica" },
];

function UploadProductPage(props) {
  const [titleValue, setTitleValue] = useState(""); // 제목
  const [descriptionValue, setDescriptionValue] = useState(""); // 설명
  const [priceValue, setPriceValue] = useState(0); // 가격
  const [continentValue, setContinentValue] = useState(1); // 대륙 (Africa가 기본 값)

  // FileUpload 컴포넌트에서 가져오는 값(업로드된 이미지)
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const onTitleChange = (event) => {
    setTitleValue(event.currentTarget.value);
  };

  const onDescriptionChange = (event) => {
    setDescriptionValue(event.currentTarget.value);
  };

  const onPriceChange = (event) => {
    setPriceValue(event.currentTarget.value);
  };

  const onContinentSelectChange = (event) => {
    setContinentValue(event.currentTarget.value);
  };

  const updateImages = (newImages) => {
    console.log(newImages);
    setImages(newImages);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (
      !titleValue ||
      !descriptionValue ||
      !priceValue ||
      !continentValue ||
      !images
    ) {
      return alert("fill all the fields first");
    }

    const variables = {
      writer: props.user.userData._id,
      title: titleValue,
      description: descriptionValue,
      price: priceValue,
      images: images,
      continents: continentValue,
    };

    axios.post("/api/product/uploadProduct", variables).then((response) => {
      if (response.data.success) {
        alert("Product Succefully Uploaded");
        navigate("/"); // 등록 성공하면, 메인 페이지로 이동
      } else {
        alert("Failed to upload Product");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Travel Product</Title>
      </div>
      <Form onSubmit={onSubmit}>
        {/* Drop Zone */}
        <FileUpload refreshFunction={updateImages} />

        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={titleValue}></Input>

        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={descriptionValue} />

        <br />
        <br />
        <label>Price($)</label>
        <Input onChange={onPriceChange} value={priceValue} type="number" />

        <br />
        <br />
        <select onChange={onContinentSelectChange}>
          {Continent.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}
        </select>

        <br />
        <br />
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
