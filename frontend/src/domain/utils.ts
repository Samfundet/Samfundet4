import { t } from 'i18next';
import { toast } from 'react-toastify';
import { KEY } from '~/i18n/constants';

export function defaultOnError(err: Error) {
  toast.error(t(KEY.common_something_went_wrong));
  console.error(err);
}
