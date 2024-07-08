import { combineReducers } from "redux";
import user from "./user_reducer";

//여러 reducer들을 combineReducers를 이용해서 하나로 합쳐줌
const rootReducer = combineReducers({
  user,
});

export default rootReducer;
