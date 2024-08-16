import React, { useEffect, useState } from "react";
import { Badge, Menu } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; //Redux 상태를 가져오기 위한 hook
import {
  UserOutlined,
  ShoppingCartOutlined,
  UploadOutlined,
} from "@ant-design/icons";

function RightMenu(props) {
  const user = useSelector((state) => state.user); //Redux 상태에서 현재 사용자 정보를 가져옴
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(); //현재 사용자 정보를 저장할 상태
  const [selectedKeys, setSelectedKeys] = useState([]); //선택된 메뉴 항목의 키를 저장할 상태

  useEffect(() => {
    if (user.userData) {
      setUserInfo(user.userData);
    }
  }, [user.userData]);

  //서버에 로그아웃 요청을 보내고, 성공하면 로그인 페이지로 이동
  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        setSelectedKeys([]); // 선택된 키 초기화 (로그아웃시 클릭한 상태 초기화)
        navigate("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  //로그인이 되어 있지 않은 사용자를 위한 메뉴 항목
  const guestMenuItems = [
    {
      key: "guest",
      label: <span style={{ width: "300px" }}>Guest</span>,
      icon: <UserOutlined />,
      children: [
        {
          key: "signin",
          label: <a href="/login">Log in</a>,
        },
        {
          key: "signup",
          label: <a href="/register">Sign up</a>,
        },
      ],
    },
  ];

  const userMenuItems = [
    {
      key: "user",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {userInfo ? (
            <>
              <img
                src={userInfo.image}
                style={{
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  objectFit: "cover",
                  marginRight: "8px",
                }}
                alt=""
              />
              {userInfo.name}
            </>
          ) : (
            <>
              <UserOutlined style={{ marginRight: "10px" }} />
              Guest
            </>
          )}
        </div>
      ),
      children: [
        {
          key: "mypage",
          label: <a href="/mypage">My Page</a>,
        },
        {
          key: "logout",
          label: (
            <button
              onClick={logoutHandler}
              style={{
                background: "none",
                border: "none",
                color: "red",
                cursor: "pointer",
                padding: 0,
                font: "inherit",
              }}
            >
              Logout
            </button>
          ),
        },
      ],
    },
  ];

  const items =
    user.userData && !user.userData.isAuth ? guestMenuItems : userMenuItems;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "auto",
        marginRight: "3px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* 장바구니 */}
        <Badge
          count={
            (user.userData &&
              user.userData.cart &&
              user.userData.cart.length) ||
            0
          }
        >
          <a href="/user/cart" style={{ padding: "0px" }}>
            <ShoppingCartOutlined style={{ fontSize: 24, marginRight: 8 }} />
          </a>
        </Badge>

        {/* 업로드 */}
        <a href="/product/upload" style={{ padding: "0px", marginLeft: 16 }}>
          <UploadOutlined style={{ fontSize: 24 }} />
        </a>
      </div>
      <Menu
        mode={props.mode}
        items={items}
        selectedKeys={selectedKeys}
        onClick={(e) => setSelectedKeys([e.key])}
      />
    </div>
  );
}

export default RightMenu;
