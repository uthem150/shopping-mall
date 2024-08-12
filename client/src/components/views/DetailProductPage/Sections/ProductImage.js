import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "./ProductImage.css";

function ProductImage(props) {
  const [Images, setImages] = useState([]); //이미지 데이터 배열 저장

  //props.detail 변경될 때마다 실행
  useEffect(() => {
    //props.detail.images가 존재하고, 배열이 비어있지 않을 때만 실행
    if (props.detail.images && props.detail.images.length > 0) {
      let images = [];

      props.detail.images &&
        props.detail.images.forEach((item) => {
          images.push({
            original: `http://localhost:5000/${item}`, //큰 이미지 URL.
            thumbnail: `http://localhost:5000/${item}`, //썸네일 이미지 URL
          });
        });
      setImages(images); //이미지 배열 Images 상태로 설정
    }
  }, [props.detail]);

  return (
    <div className="image-gallery">
      <ImageGallery
        items={Images} //Images 배열을 ImageGallery에 전달
        showThumbnails={false}
        additionalClass="custom-image-gallery" // 커스텀 스타일을 적용하기 위해 클래스 추가
      />
    </div>
  );
}

export default ProductImage;
