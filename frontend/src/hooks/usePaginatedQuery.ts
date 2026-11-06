import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PAGE_SIZE } from '~/constants';
import type { PageNumberPaginationType } from '~/types';

interface UsePaginatedQueryOptions<T> {
  queryKey: string[];
  queryFn: (page: number) => Promise<PageNumberPaginationType<T>>;
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginatedQueryResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;

  setCurrentPage: (page: number) => void;
  isLoading: boolean;
  error: Error | null;
}

export function usePaginatedQuery<T>({
  queryKey,
  queryFn,
  initialPage = 1,
}: UsePaginatedQueryOptions<T>): UsePaginatedQueryResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKey, currentPage],
    queryFn: () => queryFn(currentPage),
  });

  return {
    data: data?.results ?? [],
    totalItems: data?.count ?? 0,
    currentPage: data?.current_page ?? currentPage,
    totalPages: data?.total_pages ?? 1,
    pageSize: data?.page_size ?? PAGE_SIZE,
    setCurrentPage,
    isLoading,
    error,
  };
}
