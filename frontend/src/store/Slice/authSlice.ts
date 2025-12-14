import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SignInInputType } from "../../hooks/useSignInVerification";
import { AuthApi } from "../../util/api/auth.api";
import { clearUserState } from "./userSlice";
import { SignUpInputType } from "../../hooks/useSignUpVerification";

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
        rejectWithValue(res.message);
        return { success: false, message: res.message };
      }

      dispatch(setTokens(res.data));
      return { success: true };
    } catch (error) {
      console.log("Error: ", error);
      return rejectWithValue("Failed, " + error);
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signup",
  async (sigupInput: SignUpInputType, { rejectWithValue }) => {
    try {
      const res = await AuthApi.signUp(sigupInput);

      if (!res.success) {
        return rejectWithValue(res.message);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const googleSignUp = createAsyncThunk(
  "auth/signup/google",
  async (payload: { token: string; role: string }, { rejectWithValue }) => {
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
      dispatch(clearUserState());
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const refreshTokens = createAsyncThunk(
  "auth/refresh",
  async (_: void, { rejectWithValue, dispatch }) => {
    try {
      const newAccessToken = await AuthApi.refreshAccessToken();

      dispatch(setTokens(newAccessToken));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      return rejectWithValue(message);
    }
  }
);

type AuthState = {
  accessToken?: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshLoading: boolean;
  error?: string | null;
};

const initialState: AuthState = {
  accessToken: "",
  isAuthenticated: false,
  loading: false,
  refreshLoading: false,
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
        state.loading = false;
      })

      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(refreshTokens.pending, (state) => {
        state.refreshLoading = true;
      })
      .addCase(refreshTokens.fulfilled, (state) => {
        state.refreshLoading = false;
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.error = action.payload as string;
        state.refreshLoading = false;
      });
  },
});

export const { setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
