import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { KEY } from '~/i18n/constants';
import { deleteCaseDocument, postCaseDocument, putCaseDocument } from './api';
import { caseDocumentKeys } from './queryKeys';
import type { CaseDocumentDto, CaseDocumentPostDto } from './types';

export function useCreateCaseDocument() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CaseDocumentPostDto) => postCaseDocument(data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
      queryClient.invalidateQueries({ queryKey: caseDocumentKeys.all });
    },
  });
}

export function useUpdateCaseDocument() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CaseDocumentDto> }) => putCaseDocument(id, data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
      queryClient.invalidateQueries({ queryKey: caseDocumentKeys.all });
    },
  });
}

export function useDeleteCaseDocument() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => deleteCaseDocument(id),
    onSuccess: () => {
      toast.success(t(KEY.common_delete_successful));
      queryClient.invalidateQueries({ queryKey: caseDocumentKeys.all });
    },
  });
}
