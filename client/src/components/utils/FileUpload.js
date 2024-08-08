import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";

function FileUpload(props) {
  const [images, setImages] = useState([]);

  //사용자가 파일을 선택할 때 호출
  const onDrop = (files) => {
    // FormData 객체를 생성하여 파일 데이터를 포함할 수 있도록 함
    let formData = new FormData();

    // HTTP 요청 헤더를 설정하여 multipart/form-data 형식 지정
    const config = {
      header: { "content-type": "multipart/form-data" },
    };

    // 선택된 첫 번째 파일을 formData 객체에 추가
    formData.append("file", files[0]);

    // server/index.js의 app.use부분으로 요청 보냄
    // save the Image we chose inside the Node Server
    axios
      .post("/api/product/uploadImage", formData, config)
      .then((response) => {
        if (response.data.success) {
          // 응답으로 받은 데이터에서, 이미지 가져와서 상태저장
          setImages([...images, response.data.image]);
          // 부모 컴포넌트인 UploadProductPage에 값 전달
          props.refreshFunction([...images, response.data.image]);
        } else {
          alert("Failed to save the Image in Server");
        }
      });
  };

  const onDelete = (image) => {
    // 삭제하려는 이미지 찾음
    const currentIndex = images.indexOf(image); //indexOf(image)는 image가 배열의 몇 번째 요소인지 반환

    let newImages = [...images];
    newImages.splice(currentIndex, 1); // newImages 배열에서 currentIndex 위치의 이미지를 제거 (두번째 인자는 제거할 이미지 개수)

    setImages(newImages); //이미지 상태 업데이트
    props.refreshFunction(newImages); //컴포넌트 재렌더링
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {/* 업로드는 한번에 한개씩 */}
      <Dropzone onDrop={onDrop} multiple={false} maxsize={800000000}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: "300px",
              height: "240px",
              border: "1px solid lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <PlusOutlined type="plus" style={{ fontSize: "3rem" }} />
          </div>
        )}
      </Dropzone>

      {/* 업로드한 이미지를 보여주는 부분 */}
      <div
        style={{
          display: "flex",
          width: "350px",
          height: "240px",
          overflowX: "scroll",
        }}
      >
        {images.map((image, index) => (
          <div key={index} onClick={() => onDelete(image)}>
            <img
              style={{ minWidth: "300px", width: "300px", height: "240px" }}
              src={`http://localhost:5000/${image}`}
              alt={`productImg=${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
