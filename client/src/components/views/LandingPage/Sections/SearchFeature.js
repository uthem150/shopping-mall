import React, { useState } from "react";
import { Input } from "antd";

const { Search } = Input;

function SearchFeature(props) {
  const [SearchTerms, setSearchTerms] = useState(""); // 검색창에 입력하는 내용

  const onChangeSearch = (event) => {
    setSearchTerms(event.currentTarget.value);

    // Landing page로 검색 데이터 전달
    props.refreshFunction(event.currentTarget.value);
  };

  return (
    <div>
      <Search
        value={SearchTerms}
        onChange={onChangeSearch}
        placeholder="Search"
      />
    </div>
  );
}

export default SearchFeature;
