import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER, LOGOUT_USER } from "./types";
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
    .then((response) => response.data);

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
