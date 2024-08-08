import React, { useState } from "react";
import { Checkbox, Collapse } from "antd";

const { Panel } = Collapse;

function CheckBox(props) {
  const [checked, setChecked] = useState([]); //체크된 항목들 _id 담긴 배열

  //사용자가 체크박스를 선택하거나 선택 해제할 때 호출
  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value); //현재 checked 배열에서 해당 값이 있는지 확인
    const newChecked = [...checked];

    //indexOf는 배열에 없으면 -1 반환
    if (currentIndex === -1) {
      // 선택되지 않은 항목이라면
      newChecked.push(value);
    } else {
      // 이미 선택된 항목이라면
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked); //새로운 checked 배열 부모 컴포넌트로 전달
  };

  const renderCheckboxLists = () =>
    //props.list에 전달된 항목 목록 사용해 체크박스를 렌더링
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => handleToggle(value._id)} //사용자가 체크박스를 선택하거나 선택 해제할 때 handleToggle 함수 호출
          type="checkbox"
          checked={checked.indexOf(value._id) === -1 ? false : true} //checked 배열에 value._id가 있으면 true로 설정
        />
        &nbsp;&nbsp;
        <span>{value.name}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="Continents" key="1">
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
