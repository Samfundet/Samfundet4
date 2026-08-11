import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { getCaseDocument, getCaseDocumentCategories, getCaseDocuments } from '~/api';
import { caseDocumentKeys } from '~/domain';
import type { CaseDocumentDto } from '~/dto';

export function useGetCaseDocumentCategories() {
  return useQuery({
    queryKey: caseDocumentKeys.categories(),
    queryFn: getCaseDocumentCategories,
  });
}

export function useGetCaseDocuments() {
  return useQuery({
    queryKey: caseDocumentKeys.all,
    queryFn: getCaseDocuments,
  });
}

export function useGetCaseDocument(id: number, props?: Partial<UseQueryOptions<CaseDocumentDto>>) {
  return useQuery({
    queryKey: caseDocumentKeys.detail(id),
    queryFn: () => getCaseDocument(id),
    ...props,
  });
}
