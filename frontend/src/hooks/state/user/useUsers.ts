import { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch } from "react-redux";
import { fetchCurrentUSer } from "../../../store/Slice/userSlice";
import { selectCurrentUser } from "../../../store/selector/user/userSelector";
import { useNavigate } from "react-router";

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { accessToken, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { loading, error } = useSelector((state: RootState) => state.user);

  const curUser = useSelector(selectCurrentUser);

  useEffect(() => {
    async function fetchCurUser() {
      try {
        if (!accessToken || !isAuthenticated)
          throw new Error(
            "No accessToken or user is not authenticated do run fetch user state"
          );

        await dispatch(fetchCurrentUSer());
        navigate("/");
      } catch (error) {
        console.error("failed to fetch user", error);
      }
    }
    fetchCurUser();
  }, [accessToken]);

  return {
    loading,
    curUser,
    role: curUser?.role,
  };
};
