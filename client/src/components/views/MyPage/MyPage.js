import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function MyPage() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인된 사용자 정보 가져오기
    if (user.userData && user.userData.isAuth) {
      setUserInfo(user.userData);
      setLoading(false);
    } else if (loading && user.userData === undefined) {
      // 로딩 중인 경우
      setLoading(true);
    } else {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      navigate("/login");
    }
  }, [user, navigate, loading]);

  console.log(user.userData);

  return (
    <div
      style={{
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <Title
        level={2}
        style={{
          marginBottom: "50px", // 텍스트와 이미지 사이의 간격 조정
        }}
      >
        My Page
      </Title>
      {userInfo ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={userInfo.image}
            style={{
              borderRadius: "50%", // 모서리 둥글게
              width: "70px",
              height: "70px",
              objectFit: "cover", // 이미지가 컨테이너에 맞게 조정되도록
              marginBottom: "50px", // 텍스트와 이미지 사이의 간격 조정
            }}
          />
          <div style={{ fontSize: "17px" }}>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Name:</strong> {userInfo.name}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default MyPage;
