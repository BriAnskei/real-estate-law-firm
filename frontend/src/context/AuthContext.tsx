import React, { createContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { refreshTokens } from "../store/Slice/authSlice";
import { fetchCurrentUser } from "../store/Slice/userSlice";
import { AxiosError } from "axios";

const AuthContext = createContext(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated, accessToken, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const hasFetchedUser = useRef(false);
  const hasAttemptedRefresh = useRef(false);

  // this function will reattemp to fetch curr user after refreshing the page
  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated || hasAttemptedRefresh.current) return;

      hasAttemptedRefresh.current = true;

      try {
        await dispatch(refreshTokens()).unwrap();
      } catch (error) {
        console.log(error);

        navigate("/signin", { replace: true });
      }
    };

    initializeAuth();
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      hasAttemptedRefresh.current = false;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated || !accessToken) {
        hasFetchedUser.current = false;
        return;
      }

      if (hasFetchedUser.current) return;

      try {
        hasFetchedUser.current = true;
        await dispatch(fetchCurrentUser()).unwrap();
      } catch (error) {
        const err = error as AxiosError;
        hasFetchedUser.current = false;
        console.error(err);

        const status = err?.response?.status || err?.status;

        if (status === 401 || status === 403) {
          navigate("/signin", { replace: true });
        }
      }
    };

    fetchUser();
  }, [isAuthenticated, accessToken, dispatch, navigate]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath === "/signin" || currentPath === "/signup";

    if (isAuthenticated && isAuthPage) {
      console.log("redirecting to fomepage: ", isAuthenticated);
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, loading]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};
