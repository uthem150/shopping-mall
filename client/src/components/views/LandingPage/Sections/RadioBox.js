import React, { useState } from "react";
import { Collapse, Radio } from "antd";
const { Panel } = Collapse;

function RadioBox(props) {
  const [Value, setValue] = useState("0"); //초기값은 "0"으로 설정

  const renderRadioBox = () =>
    //부모 컴포넌트에서 전달받은 가격 범위 목록이 있다면, map
    props.list &&
    props.list.map((value) => (
      <Radio key={value._id} value={`${value._id}`}>
        {value.name}
      </Radio>
    ));

  // 라디오 버튼 선택할 때 호출
  const handleChange = (event) => {
    setValue(event.target.value);

    // 부모 컴포넌트로부터 전달받은 함수
    // 선택된 라디오 버튼 값 부모 컴포넌트에 전달해, 필터링된 제품 목록 갱신
    props.handleFilters(event.target.value);
  };

  return (
    <div>
      {/* 접히는 패널을 생성하는 컴포넌트 */}
      <Collapse defaultActiveKey={["0"]}>
        {/* Collapse 내부에 포함되는 개별 패널 */}
        <Panel header="price" key="1">
          {/* 여러 라디오 버튼을 그룹으로 묶어 하나의 선택만 가능하게 */}
          <Radio.Group onChange={handleChange} value={Value}>
            {renderRadioBox()}
          </Radio.Group>
        </Panel>
      </Collapse>
    </div>
  );
}

export default RadioBox;
