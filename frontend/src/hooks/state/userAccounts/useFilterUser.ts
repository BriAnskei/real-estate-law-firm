import React, { useCallback, useEffect, useRef, useState } from "react";
import { debouncer } from "../../../util/debouncer";
import { AppDispatch } from "../../../store/store";
import { clearUserFilter, filterUsers } from "../../../store/Slice/userSlice";

export const useFilterUser = ({ dispatch }: { dispatch: AppDispatch }) => {
  const debounceFilterRef = useRef<ReturnType<typeof debouncer> | null>(null);

  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const onFilter = !!search.length;

  useEffect(() => {
    if (search.trim()) {
      setSearchLoading(true);
      debounceFilterRef.current!(search);
    }
  }, [search]);

  const handleFilter = useCallback(async (query: string) => {
    try {
      await dispatch(filterUsers(query));
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!debounceFilterRef.current) {
      debounceFilterRef.current = debouncer(handleFilter, 400);
    }
  }, [handleFilter]);

  const handleOnFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const clearFilter = () => {
    dispatch(clearUserFilter());
    setSearch("");
  };

  return {
    handleOnFilterChange,
    searchLoading,
    search,
    clearFilter,
    onFilter,
  };
};
