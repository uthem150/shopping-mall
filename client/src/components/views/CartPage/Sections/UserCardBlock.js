import React from "react";

function UserCardBlock(props) {
  // 이미지 배열에서 첫번째 이미지만 보이도록
  // 배열의 길이가 0보다 크면, 첫 번째 이미지 선택
  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0];
      return `http://localhost:5000/${image}`;
    }
  };

  const renderItems = () =>
    props.products &&
    props.products.map((product) => (
      //테이블의 행(tr)으로 렌더링
      <tr key={product._id}>
        <td>
          <a href={`/product/${product._id}`}>
            <img
              style={{ width: "100px" }}
              alt="product"
              src={renderCartImage(product.images)}
            />
          </a>
        </td>
        <td>{product.quantity} EA</td>
        <td>$ {product.price} </td>
        <td>
          {/* 부모 컴포넌트로부터 전달된 함수로, 상품의 ID를 인수로 전달해서 제거 */}
          <button onClick={() => props.removeItem(product._id)}>Remove</button>
        </td>
      </tr>
    ));

  return (
    <div>
      <table>
        {/* 테이블의 머리글 정의 */}
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product Quantity</th>
            <th>Product Price</th>
            <th>Remove from Cart</th>
          </tr>
        </thead>
        {/* 테이블의 본문 정의 */}
        <tbody>{renderItems()}</tbody>
      </table>
    </div>
  );
}

export default UserCardBlock;
