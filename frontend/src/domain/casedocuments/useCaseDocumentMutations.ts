import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { deleteCaseDocument as apiDeleteCaseDocument, postCaseDocument, putCaseDocument } from '~/api';
import { caseDocumentKeys } from '~/domain';
import type { CaseDocumentDto, CaseDocumentPostDto } from '~/dto';
import { KEY } from '~/i18n/constants';

export function useCaseDocumentMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createCaseDocument = useMutation({
    mutationFn: (data: CaseDocumentPostDto) => postCaseDocument(data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const editCaseDocument = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CaseDocumentDto> }) => putCaseDocument(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseDocumentKeys.all });
      toast.success(t(KEY.common_save_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const deleteCaseDocument = useMutation({
    mutationFn: (id: number) => apiDeleteCaseDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseDocumentKeys.all });
      toast.success(t(KEY.common_delete_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  return { createCaseDocument, editCaseDocument, deleteCaseDocument };
}
