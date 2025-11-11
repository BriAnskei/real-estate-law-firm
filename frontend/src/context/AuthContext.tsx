import React, { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { refreshTokens } from "../store/Slice/authSlice";
import { fetchCurrentUser } from "../store/Slice/userSlice";

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

        await dispatch(refreshTokens()).unwrap();
      } catch (error) {
        console.log(error);
        navigate("/signin");
      }
    };

    refreshAccessToken();
  }, [dispatch, isAuthenticated, accessToken]);

  useEffect(() => {
    /**
     * this will trigger after the user successfully logged in,
     * will automatically fetch the current user
     */
    const fetchUser = async () => {
      if (!accessToken || !isAuthenticated) return;

      await dispatch(fetchCurrentUser()).unwrap();

      const authPaths = ["/signin", "/signup"];
      if (authPaths.includes(location.pathname)) {
        navigate("/");
      }
    };

    fetchUser();
  }, [accessToken, isAuthenticated, dispatch, navigate]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};
