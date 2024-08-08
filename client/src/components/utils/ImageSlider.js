import React from "react";
import { Carousel } from "antd";

// 기본 값으로 빈 배열을 설정하여 props.images가 정의되지 않았을 때도 안전하게 처리
function ImageSlider({ images = [] }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "150px" }}>
      {/* Carousel 컴포넌트를 사용해서, 이미지 자동으로 슬라이드 */}
      {/* autoplay 속성 부여하여 슬라이드가 자동으로 넘겨지도록 */}
      <Carousel autoplay>
        {images.length > 0 ? (
          images.map((image, index) => (
            <div key={index}>
              <div
                style={{
                  display: "grid",
                  justifyItems: "center",
                }}
              >
                <img
                  style={{
                    maxHeight: "150px",
                    objectFit: "cover", // 비율을 유지하며 이미지 조정 (contain으로 하면 축소됨)
                    objectPosition: "center",
                    minWidth: "100%", // 짧은 쪽을 기준으로 100% 유지
                    minHeight: "100%", // 짧은 쪽을 기준으로 100% 유지
                  }}
                  src={`http://localhost:5000/${image}`}
                  alt={`productImage-${index}`} // 이미지가 로드되지 않을 때 대체 텍스트
                />
              </div>
            </div>
          ))
        ) : (
          <div>No Images Available</div> // 이미지가 없는 경우 표시할 대체 UI
        )}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
