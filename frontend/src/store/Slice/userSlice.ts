import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "./normalizeState";
import { UserApi } from "../../util/api/user.api";

export const fetchCurrentUSer = createAsyncThunk(
  "user/fetchCurUSer",
  async (token: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await UserApi.fetchUser(token);

      if (!res.success) {
        return rejectWithValue(res.message);
      }

      dispatch(setCurUser(res.data));
    } catch (error) {
      return rejectWithValue("Error, " + error);
    }
  }
);

export enum Roles {
  foundingManager = "founding-manager/admin",
  lawyer = "lawyer",
  paralegal = "paralegal",
  processServer = "process-server",
}

export type UserType = {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Roles;
};

interface UserState extends NormalizeState<UserType> {
  filterById: { [key: string]: UserType };
  filterIds: string[];
  filterLoading: boolean;
  curUserId: string;
}

const initialState: UserState = {
  loading: false,
  byId: {},
  allIds: [],
  error: null,
  filterById: {},
  filterIds: [],
  filterLoading: false,
  curUserId: "",
};

const useSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurUser: (state, action) => {
      const curUserData = action.payload as UserType;
      const curUserId = curUserData.id!;

      state.curUserId = curUserId!;
      if (!state.byId[curUserId!]) {
        state.byId[curUserId!] = curUserData;
        state.curUserId = curUserId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUSer.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUSer.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchCurrentUSer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurUser } = useSlice.actions;
export default useSlice.reducer;
