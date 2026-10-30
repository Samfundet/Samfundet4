import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { ID } from '../types';
import { getCaseDocument, getCaseDocumentCategories, getCaseDocuments } from './api';
import { caseDocumentKeys } from './queryKeys';
import type { CaseDocumentCategoryDto, CaseDocumentDto } from './types';

export function useGetCaseDocumentCategories(props?: Partial<UseQueryOptions<CaseDocumentCategoryDto[]>>) {
  return useQuery({
    queryKey: caseDocumentKeys.categories(),
    queryFn: getCaseDocumentCategories,
    ...props,
  });
}

export function useGetCaseDocuments(props?: Partial<UseQueryOptions<CaseDocumentDto[]>>) {
  return useQuery({
    queryKey: caseDocumentKeys.list(),
    queryFn: getCaseDocuments,
    ...props,
  });
}

export function useGetCaseDocument(id: ID, props?: Partial<UseQueryOptions<CaseDocumentDto>>) {
  return useQuery({
    queryKey: caseDocumentKeys.detail(id),
    queryFn: () => getCaseDocument(id),
    ...props,
  });
}
