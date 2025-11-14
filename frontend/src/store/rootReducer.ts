import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./Slice/authSlice";
import UserReducer from "./Slice/userSlice";
import CaseReducer from "./Slice/case.slice";
import ClientReducer from "./Slice/client.slice";

const rootReducer = combineReducers({
  auth: AuthReducer,
  user: UserReducer,
  case: CaseReducer,
  client: ClientReducer,
});

export default rootReducer;
