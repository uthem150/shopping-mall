import React, { useState } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button } from "antd";
import { AlignRightOutlined } from "@ant-design/icons";
import "./Sections/Navbar.css";

function NavBar() {
  const [open, setOpen] = useState(false); //Drawer의 open 상태 관리

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <nav
      className="menu"
      style={{ position: "fixed", zIndex: 5, width: "100%" }}
    >
      <div className="nav_wrapper">
        <div className="menu__logo">
          <a href="/">Logo</a>
        </div>
        <div className="menu__container">
          <div className="menu_left">
            <LeftMenu mode="horizontal" />
          </div>
          <div className="menu_right">
            <RightMenu mode="horizontal" />
          </div>

          {/* 모바일 화면에서 Drawer 여는 버튼 */}
          <Button
            className="menu__mobile-button"
            type="primary"
            onClick={showDrawer}
          >
            <AlignRightOutlined />
          </Button>
          {/* 오른쪽에서 슬라이드로 나오는 메뉴 */}
          <Drawer
            title="Basic Drawer"
            placement="right"
            className="menu_drawer"
            closable={false}
            onClose={onClose}
            open={open}
          >
            <LeftMenu mode="inline" />
            <RightMenu mode="inline" />
          </Drawer>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
