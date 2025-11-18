import { useCallback, useEffect, useRef, useState } from "react";
import useClientSelector from "../../selectors/useClientSelector";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../../store/selector/authSelector";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import {
  clearClientFilter,
  ClientType,
  fetchAllClients,
  filterClient,
} from "../../../store/Slice/client.slice";
import { useDeleteClient } from "./useDeleteClient";
import { debouncer } from "../../../util/debouncer";
import { createFilterData } from "../../../util/createFilterData";

export const useClient = () => {
  const { loading, byId, allIds, filterloading, filterIds, filterbyId } =
    useClientSelector();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch<AppDispatch>();

  // other hooks
  const deleteModal = useDeleteClient(dispatch);

  const [fetchingLoading, setFetchingLoading] = useState(false);

  // filters
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [isFiltering, setIsFiltering] = useState(false);
  const debounceFilterRef = useRef<ReturnType<typeof debouncer> | null>(null);

  useEffect(() => {
    async function initialFetch() {
      try {
        // cancel inital fetch if not authenticaed or already has data
        if (!isAuthenticated) return;
        else if (allIds.length > 0) return;

        setFetchingLoading(true);
        await dispatch(fetchAllClients()).unwrap();
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingLoading(false);
      }
    }

    initialFetch();
  }, [isAuthenticated]);

  const clearFilter = () => {
    console.log("clearing filters");
    setSearch(undefined);
    dispatch(clearClientFilter());
  };

  // filters
  const handleFilter = useCallback(async (query: string) => {
    try {
      await dispatch(filterClient(query)).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setIsFiltering(false);
    }
  }, []);

  useEffect(() => {
    if (search?.trim()) {
      setIsFiltering(true);
      debounceFilterRef.current!(search);
    }
  }, [search]);

  // initialize ref for filter
  useEffect(() => {
    if (!debounceFilterRef.current) {
      debounceFilterRef.current = debouncer(handleFilter, 400);
    }
  }, [handleFilter]);

  const displayData = createFilterData<ClientType>({
    originalData: { byId, allIds },
    filteredData: { byId: filterbyId, allIds: filterIds },
    filterOptions: {
      searchInput: search ?? undefined,
      filterLoading: isFiltering,
    },
  });

  return {
    setSearch,
    search,
    loading: loading || filterloading || fetchingLoading || isFiltering,
    displayData,
    deleteModal,
    clearFilter,
  };
};
