import { useSelector } from "react-redux";
import {
  selectCaseById,
  selectCaseIds,
  selectCaseLoading,
} from "../../../store/selector/caseSelector";
import { selectIsAuthenticated } from "../../../store/selector/authSelector";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import {
  CaseType,
  clearCaseFilter,
  filterActiveCases,
  getActiveCases,
} from "../../../store/Slice/case.slice";
import { debouncer } from "../../../util/debouncer";
import { useFilteredData } from "../../useFilterData";
import { useDeleteCase } from "../useDeleteCase";

export type filterType = "all" | "ongoing" | "complete";

const useCase = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const byId = useSelector(selectCaseById);
  const allIds = useSelector(selectCaseIds);
  const { filterById, filterIds, filterLoading } = useSelector(
    (state: RootState) => state.case
  );
  const loading = useSelector(selectCaseLoading);

  const deleteModalState = useDeleteCase(dispatch);

  // filters
  const debounceFilterRef = useRef<ReturnType<typeof debouncer> | null>(null);

  const [search, setSearch] = useState<string | undefined>();
  const [filter, setFilter] = useState<filterType>("all");
  const [fetchingFilter, setFetchingFilter] = useState(false);

  const displayData = useFilteredData<CaseType>({
    originalData: { allIds, byId },
    filteredData: { byId: filterById, allIds: filterIds },
    filterOptions: {
      searchInput: search,
      filterStatus: filter === "all" ? undefined : filter,
      filterLoading: filterLoading || fetchingFilter,
    },
  });

  useEffect(() => {
    async function initialFetch() {
      if (!isAuthenticated) return;
      if (allIds.length > 0) return;

      try {
        await dispatch(getActiveCases());
      } catch (error) {
        console.error(error);
      }
    }

    initialFetch();
  }, [isAuthenticated]);

  // handles filter
  useEffect(() => {
    if ((search?.trim() || filter !== "all") && debounceFilterRef.current) {
      setFetchingFilter(true);
      debounceFilterRef.current({
        query: search,
        ...(filter !== "all" && { status: filter }),
      });
    } else {
      dispatch(clearCaseFilter());
    }
  }, [search, filter]);

  const filterCases = useCallback(
    async (payload: { query?: string; status: "ongoing" | "complete" }) => {
      try {
        await dispatch(filterActiveCases(payload));
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingFilter(false);
      }
    },
    []
  );

  useEffect(() => {
    debounceFilterRef.current = debouncer(filterCases, 400);
  }, [filterCases]);

  const clearFilterInput = () => {
    setSearch(undefined);
    setFilter("all");
  };

  return {
    displayData,
    loading: loading || filterLoading || fetchingFilter,
    search,
    setSearch,
    filter,
    setFilter,
    clearFilterInput,

    ...deleteModalState,
  };
};

export default useCase;
