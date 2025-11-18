import { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "../../../store/Slice/userSlice";
import { useFilterUser } from "./useFilterUser";
import { createFilterData } from "../../../util/createFilterData";
import { selectIsAuthenticated } from "../../../store/selector/authSelector";

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { allIds, byId, filterIds, filterById, loading, filterLoading } =
    useSelector((state: RootState) => state.user);

  const { handleOnFilterChange, searchLoading, search, clearFilter, onFilter } =
    useFilterUser({
      dispatch,
    });

  useEffect(() => {
    async function fetch() {
      try {
        if (!isAuthenticated) return;
        else if (allIds.length) return;

        await dispatch(fetchAllUsers());
      } catch (error) {
        console.error(error);
      }
    }
    fetch();
  }, [isAuthenticated]);

  const userStateData = createFilterData({
    originalData: { allIds, byId },
    filteredData: { byId: filterById, allIds: filterIds },
    filterOptions: {
      searchInput: search,
      filterLoading: filterLoading || searchLoading,
    },
  });

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
