import { useViewConsultCaseModal } from "./useViewConsultCaseModal";

import { useCaseFormModal } from "./useCaseFormModal";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  CaseType,
  clearCaseFilter,
  deleteCase,
  fetchAllUnpaidCases,
  filterUnpaidCases,
} from "../../store/Slice/case.slice";
import { selectIsAuthenticated } from "../../store/selector/authSelector";
import { useDeleteCase } from "./useDeleteCase";
import { useFilterUser } from "../state/userAccounts/useFilterUser";
import { useFilteredData } from "../useFilterData";
import { debouncer } from "../../util/debouncer";

const useConsultationCases = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { accessToken } = useSelector((state: RootState) => state.auth);

  const {
    unpaidIds: allIds,
    unpaidById: byId,

    filterById,
    filterIds,
    filterTotalPage,
    filterCurrentPage,
    totalPages,
    currentPage,
    addLoading,
  } = useSelector((state: RootState) => state.case);

  const caseFormModal = useCaseFormModal(dispatch, addLoading);
  const deleteCaseModal = useDeleteCase(dispatch);
  const viewCaseModalState = useViewConsultCaseModal();

  // filter hooks
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [sortFilter, setSortFilter] = useState<string | undefined>(undefined);
  const [filterLoading, setFilterLoading] = useState(false);

  const onFiltered = !!search?.length;

  // filter ref
  const debounceFilter = useRef<ReturnType<typeof debouncer> | null>(null);

  useEffect(() => {
    // initial fetch
    async function fetchAll() {
      // only fetch when authentication is succufully initialized and  there is no data
      if (!accessToken || !isAuthenticated || allIds.length > 0) return;

      try {
        await dispatch(fetchAllUnpaidCases({})).unwrap();
      } catch (error) {
        console.log(error);
      }
    }

    fetchAll();
  }, [isAuthenticated, accessToken]);

  const loadMore = useCallback(async (nextPage?: number) => {
    const pageToFetch = nextPage ?? currentPage + 1;

    if (pageToFetch > totalPages) return;

    try {
      await dispatch(fetchAllUnpaidCases({ page: pageToFetch }));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // filter
  const handleFilter = useCallback(
    async (payload: {
      page?: number;
      filters: { query?: string; sortFilter?: string };
    }) => {
      try {
        await dispatch(filterUnpaidCases(payload));
      } catch (error) {
        console.error(error);
      } finally {
        setFilterLoading(false);
      }
    },
    []
  );

  const handleResetFilters = () => {
    setSearch(undefined);
    setSortFilter(undefined);
  };

  // initialize debouncer filter function
  useEffect(() => {
    debounceFilter.current = debouncer(handleFilter, 400);
  }, [handleFilter]);

  useEffect(() => {
    if (
      (search?.trim() || sortFilter !== undefined) &&
      debounceFilter.current
    ) {
      setFilterLoading(true);
      debounceFilter.current({
        filters: { query: search, sortFilter: sortFilter },
      });
    } else {
      dispatch(clearCaseFilter());
    }
  }, [search, sortFilter]);

  const loadMoreFilters = useCallback(
    async (nextPage?: number) => {
      const pageToFetch = nextPage ?? filterCurrentPage + 1;

      if (pageToFetch > filterTotalPage) return;

      try {
        await handleFilter({
          page: pageToFetch,
          filters: { query: search, sortFilter },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [search, sortFilter]
  );

  const displayData = useFilteredData<CaseType>({
    originalData: { byId, allIds },
    filteredData: { byId: filterById, allIds: filterIds },
    filterOptions: {
      searchInput: search,
      filterStatus: sortFilter === "consultation_date" ? sortFilter : undefined,
      filterLoading: filterLoading,
    },
  });

  return {
    handleResetFilters,
    deleteCaseModal,
    viewCaseModalState,
    loadMore,
    onFiltered,
    filterLoading,
    setSearch,
    search,
    sortFilter,
    setSortFilter,
    caseFormModal,
    displayData,
    totalPages: onFiltered ? filterTotalPage : totalPages,
    loadMoreFilters,
    currentPage,
  };
};

// util functions
export function dateDisplay(dateData: Date): string {
  const today = isToday(dateData);

  return today
    ? dateData.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : dateData.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function isTodayOrWithin3Days(date: Date): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const consultDate = new Date(date);
  consultDate.setHours(0, 0, 0, 0);

  const diff = consultDate.getTime() - now.getTime();
  const threeDays = 3 * 24 * 60 * 60 * 1000;

  return diff >= 0 && diff <= threeDays;
}

export default useConsultationCases;
