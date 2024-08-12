import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems, removeCartItem } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";
import { Result, Empty } from "antd";
import axios from "axios";

function CartPage(props) {
  const dispatch = useDispatch(); // Redux의 dispatch 함수를 가져옴

  const [Total, setTotal] = useState(0); // 총 금액
  const [ShowTotal, setShowTotal] = useState(false); // 총 금액 보여줄지 여부
  const [ShowSuccess, setShowSuccess] = useState(false); // 구매 성공 여부

  //장바구니 아이템 로드
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

  //총 금액 계산
  useEffect(() => {
    if (props.user.cartDetail && props.user.cartDetail.length > 0) {
      calculateTotal(props.user.cartDetail);
    }
  }, [props.user.cartDetail]);

  // 계산 후 Total상태에 저장
  const calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.forEach((item) => {
      // console.log(item);
      total += parseInt(item.price, 10) * item.quantity;
    });

    // console.log(total);
    setTotal(total);
    setShowTotal(true);
  };

  const removeFromCart = async (productId) => {
    try {
      // Redux 액션 removeCartItem을 디스패치하여, 서버에 해당 상품을 장바구니에서 제거하라는 요청을 보냄
      await dispatch(removeCartItem(productId));

      // 장바구니 정보 다시 가져와서 상태 업데이트
      const response = await axios.get("/api/users/userCartInfo");

      if (response.data.success) {
        // 장바구니가 비어 있는 경우 총액을 숨김
        if (response.data.cartDetail.length <= 0) {
          setShowTotal(false);
        } else {
          // 장바구니 총액 다시 계산
          calculateTotal(response.data.cartDetail);
        }
      } else {
        // 서버에서 장바구니 정보 가져오는 데 실패한 경우
        alert("Failed to get cart info");
      }
    } catch (error) {
      // 네트워크 요청이나 기타 오류 발생 시 처리
      console.error("Error removing item from cart:", error);
      alert("There was an error removing the item from the cart.");
    }
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My Cart</h1>
      <div>
        <UserCardBlock
          products={props.user.cartDetail}
          removeItem={removeFromCart} // 아이템 삭제 함수를 props로
        />

        {ShowTotal ? (
          // ShowTotal이 true인 경우, 총 금액 표시
          <div style={{ marginTop: "3rem" }}>
            <h2>Total amount: ${Total} </h2>
          </div>
        ) : ShowSuccess ? (
          // ShowSuccess가 true인 경우, 구매 성공 메시지
          <Result status="success" title="Successfully Purchased Items" />
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <br />
            {/* ShowTotal과 ShowSuccess가 모두 false인 경우, 장바구니 비어있음 */}
            <Empty description={false} />
            <p>No Items In the Cart</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
