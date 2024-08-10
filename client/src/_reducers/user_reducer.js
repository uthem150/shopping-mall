import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_TO_CART_USER,
  GET_CART_ITEMS_USER,
} from "../_actions/types";

// (이전 상태, 액션) 받아서 (새로운 상태) 반환
export default function (state = {}, action) {
  switch (action.type) {
    case REGISTER_USER:
      return { ...state, register: action.payload }; //사용자가 등록되었을 때 상태를 업데이트
    case LOGIN_USER:
      return { ...state, loginSucces: action.payload }; //현재 상태 복사하고, loginSuccess 속성에 action.payload(id) 할당한 새로운 상태 반환
    case AUTH_USER:
      return { ...state, userData: action.payload };
    case LOGOUT_USER:
      return { ...state };
    case ADD_TO_CART_USER:
      return {
        ...state, //기존 상태의 userData를 유지하고, cart 키에 새로운 장바구니 정보 할당
        userData: {
          ...state.userData,
          cart: action.payload,
        },
      };
    case GET_CART_ITEMS_USER:
      return {
        ...state,
        cartDetail: action.payload,
      };
    default:
      return state;
  }
}
