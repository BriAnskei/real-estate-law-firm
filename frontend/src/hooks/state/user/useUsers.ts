import { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "../../../store/Slice/userSlice";
import { useFilterUser } from "./useFilterUser";
import { createFilterData } from "../../../util/createFilterData";

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { allIds, byId, filterIds, filterById, loading, filterLoading } =
    useSelector((state: RootState) => state.user);

  const { accessToken, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const { handleOnFilterChange, searchLoading, search, clearFilter, onFilter } =
    useFilterUser({
      dispatch,
    });

  const userStateData = createFilterData({
    originalData: { allIds, byId },
    filteredData: { byId: filterById, allIds: filterIds },
    filterOptions: {
      searchInput: search,
      filterLoading: filterLoading || searchLoading,
    },
  });

  useEffect(() => {
    async function fetchAll() {
      if (!accessToken || !isAuthenticated || userStateData.allIds.length > 0)
        return;

      await dispatch(fetchAllUsers());
    }
    fetchAll();
  }, [accessToken, isAuthenticated]);

  return {
    loading: loading || filterLoading || searchLoading,
    byId: userStateData.byId,
    allIds: userStateData.allIds,
    handleOnFilterChange,
    clearFilter,
    onFilter,
    search,
  };
};
