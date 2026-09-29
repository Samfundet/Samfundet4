import { t } from 'i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { KEY } from '~/i18n/constants';

export function zodEnum<T extends z.EnumLike>(enumObj: T, message: string) {
  return z.nativeEnum(enumObj, { errorMap: () => ({ message }) });
}

export function defaultOnError(err: Error) {
  toast.error(t(KEY.common_something_went_wrong));
  console.error(err);
}
