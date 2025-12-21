import { useCallback, useEffect, useRef, useState } from "react";
import { SessionLogType } from "../../../types/user_sessionType";
import { UserSessionApi } from "../../../util/api/user_session.api";
import { createChangeHandler } from "../../../util/createOnChangeHandler";
import { debouncer } from "../../../util/debouncer";

const useSessionLogState = () => {
  const [usersSessions, setUsersSessions] = useState<SessionLogType[]>([]);

  useEffect(() => {}, []);

  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);

  const setSessionPagination = useCallback(
    (payload: {
      data: SessionLogType[];
      page: number;
      totalPages: number;
      total: number;
    }) => {
      setUsersSessions(payload.data);

      setPage(payload.page);
      setTotalPage(payload.totalPages);
      setTotal(payload.total);
    },
    [setUsersSessions, setPage, setTotalPage, setTotal]
  );

  return {
    usersSessions,
    totalPage,
    total,
    setSessionPagination,
    page,
  };
};

const useSessionLogFilter = () => {
  const [filter, setFilter] = useState<FilterType>({
    query: "",
    startDate: "",
    endDate: "",
  });
  const onFilterChange = createChangeHandler<FilterType>(setFilter);

  const clearFilter = () => {
    setFilter({ query: "", startDate: "", endDate: "" });
  };

  return {
    onFilterChange,
    filter,
    onfiltered:
      Boolean(filter.query.trim()) ||
      Boolean(filter.startDate.trim()) ||
      Boolean(filter.endDate.trim()),
    clearFilter,
  };
};

export type FilterType = {
  query: string;
  startDate: string;
  endDate: string;
};

export const useUserLogs = () => {
  const [loading, setLoading] = useState(true);

  const { page, total, totalPage, usersSessions, setSessionPagination } =
    useSessionLogState();

  const { filter, onFilterChange, onfiltered, clearFilter } =
    useSessionLogFilter();

  // filter ref
  const debounceFilter = useRef<ReturnType<typeof debouncer> | null>(null);

  // Fetch function that accepts page parameter
  const fetchSessions = useCallback(
    async (
      currentPage: number,
      filters?: { query?: string; startDate?: string; endDate?: string }
    ) => {
      try {
        setLoading(true);

        const response = await UserSessionApi.fetch({
          page: currentPage,
          limit: 10,
          filters,
        });

        setSessionPagination(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [setSessionPagination]
  );

  // initial fetch
  useEffect(() => {
    fetchSessions(1);
  }, []);

  useEffect(() => {
    if (!debounceFilter.current) {
      debounceFilter.current = debouncer(fetchSessions, 400);
    }
  }, [fetchSessions]);

  useEffect(() => {
    if (debounceFilter.current && onfiltered) {
      debounceFilter.current(1, filter);
    } else {
      fetchSessions(1);
    }
  }, [filter.query, filter.startDate, filter.endDate]);

  // Function to change page
  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchSessions(newPage);
    },
    [fetchSessions]
  );

  return {
    usersSessions,
    loading,
    page,
    totalPage,
    total,
    onFilterChange,
    filter,
    handlePageChange,
    clearFilter,

    onfiltered,
  };
};
