import { Button, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import FileUpload from "../../utils/FileUpload";

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

function UploadProductPage() {
  const [titleValue, setTitleValue] = useState(""); // 제목
  const [discriptionValue, setDiscriptionValue] = useState(""); // 설명
  const [priceValue, setPriceValue] = useState(0); // 가격
  const [continentValue, setContinentValue] = useState(1); // 대륙 (Africa가 기본 값)

  // FileUpload 컴포넌트에서 가져오는 값(업로드된 이미지)
  const [images, setImages] = useState([]);

  const onTitleChange = (event) => {
    setTitleValue(event.currentTarget.value);
  };

  const onDiscriptionChange = (event) => {
    setDiscriptionValue(event.currentTarget.value);
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

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Travel Product</Title>
      </div>
      <Form onSubmit>
        {/* Drop Zone */}
        <FileUpload refreshFunction={updateImages} />

        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={titleValue}></Input>

        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDiscriptionChange} value={discriptionValue} />

        <br />
        <br />
        <label>Price($)</label>
        <Input onChange={onPriceChange} value={priceValue} type="number" />

        <select onChange={onContinentSelectChange}>
          {Continent.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}
        </select>

        <br />
        <br />
        <Button>Submit</Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
