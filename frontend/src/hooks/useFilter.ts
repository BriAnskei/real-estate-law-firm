import { useCallback, useEffect, useMemo, useState } from "react";
import { debouncer } from "../util/debouncer";

type FilterOptions<T extends string = string> = Partial<
  Record<T, string | null>
>;

export function useFilter<T extends string = string>(
  onFilterChange: (filters: {
    search: string;
    filters: FilterOptions<T>;
  }) => void,
  delay = 500
) {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<FilterOptions<T>>({});
  const debouncedFilterChange = useMemo(
    () =>
      debouncer((newSearch: string, newFilters: FilterOptions<T>) => {
        onFilterChange({ search: newSearch, filters: newFilters });
      }, delay),
    [onFilterChange, delay]
  );

  const updateFilter = useCallback(
    (key: T, value: string | null) => {
      setFilters((prev) => {
        const updated = { ...prev, [key]: value };
        debouncedFilterChange(searchInput, updated);
        return updated;
      });
    },
    [debouncedFilterChange, searchInput]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      debouncedFilterChange(value, filters);
    },
    [debouncedFilterChange, filters]
  );

  useEffect(() => {
    debouncedFilterChange(searchInput, filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    searchInput,
    filters,
    handleSearchChange,
    updateFilter,
    resetFilters: () => {
      setFilters({});
      setSearchInput("");
      onFilterChange({ search: "", filters: {} });
    },
  };
}
