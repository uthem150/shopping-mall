import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import MyPage from "./views/MyPage/MyPage.js";
import UploadProductPage from "./views/UploadProductPage/UploadProductPage.js";
import DetailProductPage from "./views/DetailProductPage/DetailProductPage.js";
import CartPage from "./views/CartPage/CartPage.js";

// null   Anyone Can go inside
// true   only logged in user can go inside
// false  logged in user can't go inside

function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);
  const AuthMyPage = Auth(MyPage, true);
  const AuthUploadProductPage = Auth(UploadProductPage, true);
  const AuthDetailProductPage = Auth(DetailProductPage, null);
  const AuthCartPage = Auth(CartPage, true);

  return (
    //Suspense : 일부 컴포넌트가 로드될 때까지 로딩 상태 표시(fallback 속성으로 로딩 중일 때 표시할 내용 정의)
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
        <Routes>
          <Route path="/" element={<AuthLandingPage />} />
          <Route path="/login" element={<AuthLoginPage />} />
          <Route path="/register" element={<AuthRegisterPage />} />
          <Route path="/mypage" element={<AuthMyPage />} />
          <Route path="/product/upload" element={<AuthUploadProductPage />} />
          <Route path="/user/cart" element={<AuthCartPage />} />

          <Route
            path="/product/:productId"
            element={<AuthDetailProductPage />}
          />
        </Routes>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
