import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { PageNumberPaginationType } from '~/types';
import { useDebounce } from './useDebounce';

interface UseSearchPaginatedQueryOptions<T> {
  queryKey: string[];
  queryFn: (page: number, search: string) => Promise<PageNumberPaginationType<T>>;
  pageSize?: number;
}

interface UseSearchPaginatedQueryResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (search: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function useSearchPaginatedQuery<T>({
  queryKey,
  queryFn,
  pageSize = 10,
}: UseSearchPaginatedQueryOptions<T>): UseSearchPaginatedQueryResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKey, currentPage, debouncedSearchTerm],
    queryFn: () => queryFn(currentPage, debouncedSearchTerm),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Reset to first page when search term changes
  const handleSearchTermChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when search changes
  };

  return {
    data: data?.results ?? [],
    totalItems: data?.count ?? 0,
    currentPage: data?.current_page ?? currentPage,
    totalPages: data?.total_pages ?? 1,
    pageSize: data?.page_size ?? pageSize,
    setCurrentPage,
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    isLoading,
    error,
  };
}
