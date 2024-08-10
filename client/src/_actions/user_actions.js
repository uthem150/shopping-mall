import axios from "axios";
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  UPDATE_USER,
  ADD_TO_CART_USER,
} from "./types";
import { USER_SERVER } from "../components/Config.js"; //서버의 기본 URL 설정한 상수 가져옴

//사용자 등록하는 액션
export function registerUser(dataToSubmit) {
  //dataToSubmit을 서버의 /register 엔드포인트로 POST 요청 보냄
  const request = axios
    .post(`${USER_SERVER}/register`, dataToSubmit)
    .then((response) => response.data);

  //user_reducer에 data를 반환 (action -> reducer -> store)
  return {
    type: REGISTER_USER,
    payload: request, //서버 응답 데이터
  };
}

export function loginUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/login`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request, //서버 응답 데이터
  };
}

export function auth() {
  const request = axios
    .get(`${USER_SERVER}/auth`)
    .then((response) => response.data) //응답이 성공적으로 돌아오면, response.data 반환
    //요청이 실패하면 catch 블록 실행
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        // 에러 응답이 있고, 상태 코드가 401 (Unauthorized)인 경우를 확인
        // (사용자에게 적절한 조치를 취하거나 로그인 페이지로 리디렉션할 수도 있음)
        console.error("Authentication failed. Redirecting to login.");
        return { isAuth: false }; // 기본 응답 객체
      }
      throw error; // 다른 에러는 그대로 throw
    });

  return {
    type: AUTH_USER,
    payload: request, //서버 응답 데이터
  };
}

export function logoutUser() {
  const request = axios
    .get(`${USER_SERVER}/logout`)
    .then((response) => response.data);

  return {
    type: LOGOUT_USER,
    payload: request, //서버 응답 데이터
  };
}

export function updateUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/update`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: UPDATE_USER,
    payload: request, // 서버 응답 데이터
  };
}

export function addToCart(_id) {
  const request = axios
    .post(`${USER_SERVER}/addToCart?productId=${_id}`)
    .then((response) => response.data);

  // 액션 객체는 리듀서에 전달되어 상태 업데이트
  return {
    type: ADD_TO_CART_USER,
    payload: request, //서버 응답 데이터
  };
}
