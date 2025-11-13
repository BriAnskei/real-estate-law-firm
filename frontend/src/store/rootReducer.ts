import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./Slice/authSlice";
import UserReducer from "./Slice/userSlice";
import CaseReducer from "./Slice/case.slice";

const rootReducer = combineReducers({
  auth: AuthReducer,
  user: UserReducer,
  case: CaseReducer,
});

export default rootReducer;
