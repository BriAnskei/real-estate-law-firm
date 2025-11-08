import { useCallback, useEffect, useRef, useState } from "react";
import { debouncer } from "../../../util/debouncer";
import { RegistrationType } from "./useAccountRequest";
import { RegistrationApi } from "../../../util/api/registration.api";

export const useAccountRequestFilter = () => {
  const debounceFilterRef = useRef<ReturnType<typeof debouncer> | null>(null);

  const [filterLoading, setFilterLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [filtered, setFiltered] = useState<RegistrationType[] | undefined>(
    undefined
  );

  const onFilter = !!search?.length;

  const handleFilter = useCallback(async (searchInput: string) => {
    try {
      const res = await RegistrationApi.filter(searchInput);
      setFiltered(res);
    } catch (error) {
      console.error(error);
    } finally {
      setFilterLoading(false);
    }
  }, []);

  useEffect(() => {
    if (search && search?.trim() && debounceFilterRef.current) {
      setFilterLoading(true);
      debounceFilterRef.current(search);
    }
  }, [search]);

  useEffect(() => {
    debounceFilterRef.current = debouncer(handleFilter, 400);
  }, [handleFilter]);

  const onSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("filtreing: ", e.target.value);
    setSearch(e.target.value);
  };

  const clearFilter = () => {
    setSearch("");
    setFiltered(undefined);
    setFilterLoading(false);
  };

  return {
    filterLoading,
    filtered,
    setFiltered,
    onSearchHandler,
    onFilter,
    search,
    clearFilter,
  };
};
