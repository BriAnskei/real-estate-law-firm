import React, { createContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "../store/store";
import { useLocation, useNavigate } from "react-router-dom"; // Fixed import
import { AuthApi } from "../util/api/auth.api";
import { setTokens } from "../store/Slice/authSlice";

const AuthContext = createContext(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const state = store.getState();
        const { isAuthenticated, accessToken } = state.auth;
        if (isAuthenticated && accessToken) return;

        const newAccessToken = await AuthApi.refreshAccessToken();
        if (!newAccessToken) {
          return navigate("/signin");
        }

        dispatch(setTokens(newAccessToken));
      } catch (error) {
        const publicPaths = ["/signin", "/signup"];
        const isPublicPath = publicPaths.some((path) =>
          location.pathname.includes(path)
        );

        if (!isPublicPath) {
          navigate("/signin");
        }
      }
    };

    refreshAccessToken();
  }, [dispatch, navigate, location.pathname]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};
