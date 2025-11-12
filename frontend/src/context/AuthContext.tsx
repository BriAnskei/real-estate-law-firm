import React, { createContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { refreshTokens } from "../store/Slice/authSlice";
import { fetchAllUsers, fetchCurrentUser } from "../store/Slice/userSlice";
import { selectCurrentUser } from "../store/selector/user/userSelector";

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

  const userData = useSelector(selectCurrentUser);

  // Track if we've already fetched the user to prevent re-fetching
  const hasFetchedUser = useRef(false);

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
  }, [dispatch, isAuthenticated, accessToken, navigate]);

  useEffect(() => {
    /**
     * this will trigger after the user successfully logged in,
     * will automatically fetch the current user
     */
    const fetchUser = async () => {
      // Don't fetch if we don't have auth or if we already have user data
      if (!accessToken || !isAuthenticated) {
        hasFetchedUser.current = false;
        return;
      }

      // Only fetch if we haven't fetched yet
      if (hasFetchedUser.current) return;

      try {
        hasFetchedUser.current = true;
        await dispatch(fetchCurrentUser()).unwrap();
        await dispatch(fetchAllUsers()).unwrap();
      } catch (error) {
        hasFetchedUser.current = false;
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [accessToken, isAuthenticated, dispatch]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};
