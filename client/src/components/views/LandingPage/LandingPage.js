import React from "react";
import { FaCode } from "react-icons/fa";

// 첫 페이지
function LandingPage() {
  return (
    <>
      <div className="app">
        <FaCode style={{ fontSize: "4rem" }} />
        <br />
        <span style={{ fontSize: "2rem" }}>Hello World!</span>
      </div>
    </>
  );
}

export default LandingPage;
