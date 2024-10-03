import { SamfError } from '~/Forms/SamfForm';
import { RecruitmentFormType } from './RecruitmentFormAdminPage';

export function youtubeLinkValidator(state: RecruitmentFormType): SamfError {
  const link = state.promo_media;
  const regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/;
  if (link && !link.match(regex)) {
    return 'Not valid youtbue link';
  }
  return true;
}
