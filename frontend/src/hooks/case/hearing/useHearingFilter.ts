import { useState, useRef, useCallback, useEffect } from "react";
import { HearingType } from "../../../types/HearingTypes";
import { HearingApi } from "../../../util/api/hearing.api";
import { debouncer } from "../../../util/debouncer";
import { HearingStatus } from "./useHearing";
import { useParams } from "react-router";

export const useHearingFilter = () => {
  const { id } = useParams();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<HearingStatus | undefined>(undefined);

  const [filteredHearings, setFilteredHearings] = useState<
    HearingType[] | undefined
  >(undefined);
  const [loadingFilter, setLoadingFilter] = useState(false);

  const debounceFilter = useRef<ReturnType<typeof debouncer> | undefined>(
    undefined
  );

  const handleFilter = useCallback(
    async (payload: { query: string; status?: HearingStatus }) => {
      try {
        const response = await HearingApi.filter({
          ...payload,
          case_id: id as string,
        });
        setFilteredHearings(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFilter(false);
      }
    },
    []
  );

  const clearFilter = useCallback(() => {
    setQuery("");
    setStatus(undefined);
    setFilteredHearings(undefined);
  }, []);

  useEffect(() => {
    debounceFilter.current = debouncer(handleFilter, 400);
  }, [handleFilter]);

  useEffect(() => {
    if ((query.trim() || status) && debounceFilter.current) {
      setLoadingFilter(true);
      debounceFilter.current({ query, status });
    } else {
      clearFilter();
    }
  }, [query, status]);

  return {
    clearFilter,
    filteredHearings,
    loadingFilter,
    onFiltered: !!query.length || status !== undefined,
    setStatus,
    status,
    query,
    setQuery,
  };
};
