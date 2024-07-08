/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { auth } from "../_actions/user_actions"; //사용자 인증 상태를 확인하는 액션
import { useSelector, useDispatch } from "react-redux"; //Redux 상태를 읽고 액션을 디스패치하는 훅
import { useNavigate } from "react-router-dom";

// option (접근 권한)
// null    =>  아무나 출입이 가능한 페이지
// true    =>  로그인한 유저만 출입이 가능한 페이지
// false   =>  로그인한 유저는 출입 불가능한 페이지
// adminRoute: 관리자 전용 페이지인지 여부. 기본값은 null.

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user); //Redux 상태에서 사용자 정보를 가져옴
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      // 사용자 인증 상태를 확인하기 위해 auth 액션을 디스패치(발송)
      dispatch(auth()).then((response) => {
        // Not Loggined in Status
        if (!response.payload.isAuth) {
          if (option) {
            navigate("/login");
          }
          // Loggined in Status
        } else {
          // 인증된 사용자일 때, 관리자 페이지에 접근하려 하지만 관리자가 아닌 경우 메인 페이지로 이동
          if (adminRoute && !response.payload.isAdmin) {
            navigate("/");
          }
          // 인증된 사용자가 로그인 페이지에 접근하려 할 때, option이 false라면 메인 페이지로 이동
          else {
            if (option === false) {
              navigate("/");
            }
          }
        }
      });
    }, []);

    //컴포넌트를 렌더링할 때, 사용자 정보를 props로 전달하여 SpecificComponent 렌더링
    return <SpecificComponent {...props} user={user} />;
  }
  return AuthenticationCheck;
}
