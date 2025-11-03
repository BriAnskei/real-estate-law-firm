import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./Slice/authSlice";
import UserReducer from "./Slice/userSlice";

const rootReducer = combineReducers({
  auth: AuthReducer,
  user: UserReducer,
});

export default rootReducer;
