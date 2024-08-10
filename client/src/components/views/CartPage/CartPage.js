import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCartItems } from "../../../_actions/user_actions";

function CartPage(props) {
  const dispatch = useDispatch(); // Redux의 dispatch 함수를 가져옴

  useEffect(() => {
    let cartItems = []; //장바구니 아이템의 ID를 저장할 배열

    if (props.user.userData && props.user.userData.cart) {
      if (props.user.userData.cart.length > 0) {
        //장바구니 아이템의 ID를 cartItems 배열에 추가
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });
        //액션 크리에이터를 호출하여 장바구니 아이템의 상세 정보를 서버에서 가져옴
        //액션을 디스패치하면, Redux 미들웨어를 통해 비동기 작업이 처리되고, 스토어가 업데이트됨
        dispatch(getCartItems(cartItems, props.user.userData.cart));
      }
    }
  }, [props.user.userData]);

  return <div>CartPage</div>;
}

export default CartPage;
