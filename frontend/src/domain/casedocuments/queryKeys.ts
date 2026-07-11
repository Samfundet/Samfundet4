export const caseDocumentKeys = {
  all: ['casedocument'] as const,
  details: () => [...caseDocumentKeys.all, 'detail'] as const,
  detail: (id: number) => [...caseDocumentKeys.details(), id] as const,
  categories: () => [...caseDocumentKeys.all, 'categories'] as const,
};
