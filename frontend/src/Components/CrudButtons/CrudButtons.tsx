import { useTranslation } from 'react-i18next';
import { IconButton } from '~/Components';
import { KEY } from '~/i18n/constants';
import { COLORS } from '~/types';
import styles from './CrudButtons.module.scss';

type CrudButtonsProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function CrudButtons({ onView, onEdit, onDelete }: CrudButtonsProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.row}>
      {onView && (
        <IconButton
          onClick={onView}
          color={COLORS.green}
          title={t(KEY.common_show)}
          icon="ic:baseline-remove-red-eye"
        />
      )}
      {onEdit && <IconButton onClick={onEdit} color={COLORS.blue} title={t(KEY.common_edit)} icon="mdi:pencil" />}
      {onDelete && <IconButton onClick={onDelete} color={COLORS.red} title={t(KEY.common_delete)} icon="mdi:bin" />}
    </div>
  );
}
