import React from "react";
import { Menu } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        navigate("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  const guestMenuItems = [
    {
      key: "guest",
      label: "Guest",
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
      key: "logout",
      label: <a onClick={logoutHandler}>Logout</a>,
    },
  ];

  const items =
    user.userData && !user.userData.isAuth ? guestMenuItems : userMenuItems;

  return <Menu mode={props.mode} items={items} />;
}

export default RightMenu;
