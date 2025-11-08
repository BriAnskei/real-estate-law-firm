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

export const googleSignIn = createAsyncThunk(
  "auth/signup",
  async (
    payload: { token: string; rememberMe: boolean },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await AuthApi.googleSignIn(payload);

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

export const googleSignUp = createAsyncThunk(
  "auth/signup/google",
  async (
    payload: { token: string; rememberMe: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await AuthApi.googleSignUp(payload);

      if (!res.success) {
        return rejectWithValue(res.message);
      }
    } catch (error) {
      return rejectWithValue("Error" + error);
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signout",
  async (_: void, { rejectWithValue, dispatch }) => {
    try {
      await AuthApi.onSignOut();
      dispatch(clearAuth());
    } catch (error) {
      return rejectWithValue(error);
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
  isAuthenticated: false,
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
