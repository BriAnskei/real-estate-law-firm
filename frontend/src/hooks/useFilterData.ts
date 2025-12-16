import { useMemo } from "react";

// Types for better type safety
interface NormalizedData<T = any> {
  byId: Record<string, T>;
  allIds: string[];
}

interface FilterOptions {
  searchInput?: string;
  filterStatus?: string | null;
  filterLoading?: boolean;
  // Add other filter options as needed
  dateRange?: [Date?, Date?];
  category?: string;
  tags?: string[];
}

interface UseFilteredDataProps<T> {
  originalData: NormalizedData<T>;
  filteredData: NormalizedData<T>;
  filterOptions: FilterOptions;
}

export function useFilteredData<T>({
  originalData,
  filteredData,
  filterOptions,
}: UseFilteredDataProps<T>): NormalizedData<T> {
  const shouldShowFiltered = useMemo(() => {
    const {
      searchInput,
      filterStatus,
      filterLoading = false,
      dateRange,
      category,
      tags,
    } = filterOptions;

    // Don't show filtered data if still loading
    if (filterLoading) return false;

    // Check if any filter is active
    const hasActiveFilters = Boolean(
      searchInput?.trim() ||
        filterStatus ||
        category ||
        (tags && tags.length > 0) ||
        (dateRange && (dateRange[0] || dateRange[1]))
    );

    return hasActiveFilters;
  }, [filterOptions]);

  const data = useMemo(() => {
    return shouldShowFiltered ? filteredData : originalData;
  }, [shouldShowFiltered, filteredData, originalData]);

  return data;
}
