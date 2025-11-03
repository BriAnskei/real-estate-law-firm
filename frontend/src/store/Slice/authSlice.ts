import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SignInInputType } from "../../hooks/useSignInVerification";
import { AuthApi } from "../../util/api/auth.api";

export const signIn = createAsyncThunk(
  "auth/signup",
  async (payload: SignInInputType, { rejectWithValue, dispatch }) => {
    try {
      const res = await AuthApi.signIn(payload);

      if (!res.success) {
        return rejectWithValue(res.message);
      }

      dispatch(setTokens(res.data));
    } catch (error) {
      console.log("Error: ", error);
      return rejectWithValue("Failed, " + error);
    }
  }
);

type AuthState = {
  accessToken?: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string | null;
};

const initialState: AuthState = {
  accessToken: "",
  isAuthenticated: Boolean(localStorage.getItem("access_token")),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = true;
      });
  },
});

export const { setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
