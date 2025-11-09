import React, { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { AuthApi } from "../util/api/auth.api";
import { setTokens } from "../store/Slice/authSlice";
import { fetchCurrentUSer } from "../store/Slice/userSlice";

const AuthContext = createContext(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        if (isAuthenticated && accessToken) return;

        const newAccessToken = await AuthApi.refreshAccessToken();

        if (!newAccessToken) {
          return navigate("/signin");
        }

        dispatch(setTokens(newAccessToken));
      } catch (error) {
        console.log(error);
        navigate("/signin");
      }
    };

    console.log();
    refreshAccessToken();
  }, [dispatch, navigate, isAuthenticated, accessToken]);

  useEffect(() => {
    /**
     * this will trigger after the user successfully logged in,
     */
    const fetchUser = async () => {
      if (!accessToken || !isAuthenticated) return;
      await dispatch(fetchCurrentUSer());

      const authPaths = ["/signin", "/signup"];
      if (authPaths.includes(location.pathname)) {
        navigate("/");
      }
    };

    fetchUser();
  }, [accessToken, isAuthenticated, dispatch, navigate]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};
