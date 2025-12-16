import { useCallback, useEffect, useRef, useState } from "react";
import {
  CaseType,
  clearCaseFilter,
  filterPayments,
  getActiveCases,
} from "../../../store/Slice/case.slice";
import { useSelector } from "react-redux";
import {
  selectCaseById,
  selectCaseIds,
  selectCaseLoading,
} from "../../../store/selector/caseSelector";
import { useFilteredData } from "../../useFilterData";
import { AppDispatch, RootState } from "../../../store/store";
import { debouncer } from "../../../util/debouncer";
import { useDispatch } from "react-redux";

export type PaymentFilterType = "all" | "paid" | "partial";

const useCasePaymentFilter = () => {
  const [query, setQuery] = useState("");
  const [paidType, setPaidType] = useState<string | undefined>(undefined);

  const [filterLoading, setFilterLoading] = useState(false);

  return {
    query,
    setQuery,
    paidType,
    setPaidType,
    filterLoading,
    setFilterLoading,
  };
};

export default function usePayments() {
  const dispatch = useDispatch<AppDispatch>();
  const byId = useSelector(selectCaseById);
  const allIds = useSelector(selectCaseIds);

  const {
    filterById,
    filterIds,
    filterLoading: stateFilterLoading,
  } = useSelector((state: RootState) => state.case);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const stateLoading = useSelector(selectCaseLoading);

  const {
    query,
    setQuery,
    paidType,
    setPaidType,
    filterLoading,
    setFilterLoading,
  } = useCasePaymentFilter();
  const debounceFilterRef = useRef<ReturnType<typeof debouncer> | null>(null);

  // fetch if no data yet
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

    return () => {
      clearCaseFilter();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if ((query?.trim() || paidType) && debounceFilterRef.current) {
      setFilterLoading(true);
      debounceFilterRef.current({
        query,
        paidType,
      });
    } else {
      dispatch(clearCaseFilter());
    }
  }, [query, paidType]);

  const filterCases = useCallback(
    async (payload: { query?: string; paidType?: string }) => {
      try {
        await dispatch(filterPayments(payload));
      } catch (error) {
        console.error(error);
      } finally {
        setFilterLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    debounceFilterRef.current = debouncer(filterCases, 400);
  }, [filterCases]);

  const displayData = useFilteredData<CaseType>({
    originalData: { allIds, byId },
    filteredData: { byId: filterById, allIds: filterIds },
    filterOptions: {
      searchInput: query,
      filterStatus: paidType,
      filterLoading: filterLoading || stateFilterLoading,
    },
  });

  const clearFilterInput = () => {
    setQuery("");
    setPaidType(undefined);
  };

  // Placeholder for marking case as paid
  const markAsPaid = (caseId: string) => {
    console.log("Mark as paid:", caseId);
    // TODO: Implement API call to update case payment status
  };

  // Placeholder for viewing payment details
  const viewPaymentDetails = (caseId: string) => {
    console.log("View payment details:", caseId);
    // TODO: Implement modal open logic
  };

  return {
    displayData,

    clearFilterInput,
    markAsPaid,
    viewPaymentDetails,

    query,
    setQuery,
    paidType,
    setPaidType,
    loading: filterLoading || stateLoading,
  };
}
