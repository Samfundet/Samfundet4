import { useTranslation } from 'react-i18next';
import type { BaseModelDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { formatDateYMDWithTime, getFullDisplayName } from '~/utils';

type Props = {
  model: BaseModelDto | undefined;
};

// TODO: Could add extra functionality here like linking to the user (only if logged-in user has permissions to see users)

export function LastUpdatedByHeader({ model }: Props) {
  const { t } = useTranslation();

  if (!model) {
    return null;
  }

  const createdAtString = model?.created_at && `, ${formatDateYMDWithTime(new Date(model.created_at))}`;
  const updatedAtString = model?.updated_at && `, ${formatDateYMDWithTime(new Date(model.updated_at))}`;

  // updated_at field always gets set, with a tiny ms delay. Formatted strings rounds this down
  const isEdited =
    !!model.updated_at &&
    (createdAtString !== updatedAtString || model.updated_by?.username !== model.created_by?.username);

  return isEdited
    ? `${t(KEY.common_last_edited_by)} ${model.updated_by ? getFullDisplayName(model.updated_by) : `(${t(KEY.common_unknown).toLowerCase()})`}${updatedAtString}`
    : `${t(KEY.common_created_by)} ${model?.created_by ? getFullDisplayName(model.created_by) : `(${t(KEY.common_unknown).toLowerCase()})`}${createdAtString}`;
}
