import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; //Redux 상태를 가져오기 위한 hook
import { UserOutlined } from "@ant-design/icons";

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
            justifyContent: "flex-end",
            width: "auto",
          }}
        >
          {userInfo ? (
            <>
              <img
                src={userInfo.image}
                style={{
                  borderRadius: "50%", // 모서리 둥글게
                  width: "24px",
                  height: "24px",
                  objectFit: "cover", // 이미지가 컨테이너에 맞게 조정되도록
                  marginRight: "8px", // 텍스트와 이미지 사이의 간격 조정
                }}
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
          key: "logout",
          label: <a onClick={logoutHandler}>Logout</a>,
        },
      ],
    },
  ];

  //게스트면 guestMenuItems를 사용, 유저면 userMenuItems를 사용
  const items =
    user.userData && !user.userData.isAuth ? guestMenuItems : userMenuItems;

  return (
    <Menu
      mode={props.mode}
      items={items}
      selectedKeys={selectedKeys}
      onClick={(e) => setSelectedKeys([e.key])}
    />
  );
}

export default RightMenu;
