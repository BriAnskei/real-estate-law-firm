import React, { createContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "../store/store";
import { useNavigate } from "react-router";
import { AuthApi } from "../util/api/auth.api";
import { setTokens } from "../store/Slice/authSlice";

const AuthContext = createContext(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const state = store.getState();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const { isAuthenticated, accessToken } = state.auth;
        if (isAuthenticated && accessToken) return;

        const newAcessToken = await AuthApi.refreshAccessToken();

        dispatch(setTokens(newAcessToken));
      } catch (error) {
        //No valid refresh token, user not logged in.
        console.error(error);
        navigate("/signin");
      }
    };
    refreshAccessToken();
  }, []);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};
