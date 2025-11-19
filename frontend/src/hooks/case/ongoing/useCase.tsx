import { useSelector } from "react-redux";
import {
  selectCaseById,
  selectCaseIds,
  selectCaseLoading,
} from "../../../store/selector/caseSelector";
import { selectIsAuthenticated } from "../../../store/selector/authSelector";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { fetchAllCases } from "../../../store/Slice/case.slice";

const useCase = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const byId = useSelector(selectCaseById);
  const allIds = useSelector(selectCaseIds);
  const loading = useSelector(selectCaseLoading);

  // filters
  const [search, setSearch] = useState<string | undefined>();
  const [filter, setFilter] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    async function initialFetch() {
      if (!isAuthenticated) return;
      if (allIds.length > 0) return;

      try {
        await dispatch(fetchAllCases());
      } catch (error) {
        console.error(error);
      }
    }

    initialFetch();
  }, [isAuthenticated]);

  const clearFilter = () => {
    setSearch("");
    setFilter("");
  };

  const openCaseTransaction = () => {};

  const deleteCase = () => {};

  return {
    displayData: { allIds, byId },
    loading: loading || filterLoading,
    search,
    setSearch,
    filter,
    setFilter,
    clearFilter,
    openCaseTransaction,
    deleteCase,
  };
};

export default useCase;
