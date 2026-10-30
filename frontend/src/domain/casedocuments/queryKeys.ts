import type { ID } from '../types';

export const caseDocumentKeys = {
  all: ['casedocument'] as const,
  lists: () => [...caseDocumentKeys.all, 'list'] as const,
  list: () => [...caseDocumentKeys.lists(), {}] as const,
  details: () => [...caseDocumentKeys.all, 'detail'] as const,
  detail: (id: ID) => [...caseDocumentKeys.details(), id] as const,
  categories: () => [...caseDocumentKeys.all, 'categories'] as const,
};
