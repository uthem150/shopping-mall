import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import Axios from "axios";

function FileUpload(props) {
  const [images, setImages] = useState([]);

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    // server/index.js의 app.use부분으로 요청 보냄
    // save the Image we chose inside the Node Server
    Axios.post("/api/product/uploadImage", formData, config).then(
      (response) => {
        if (response.data.success) {
          // 응답으로 받은 데이터에서, 이미지 가져와서 상태저장
          setImages([...images, response.data.image]);
          // 부모 컴포넌트인 UploadProductPage에 값 전달
          props.refreshFunction([...images, response.data.image]);
        } else {
          alert("Failed to save the Image in Server");
        }
      }
    );
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
          <div onClick>
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
