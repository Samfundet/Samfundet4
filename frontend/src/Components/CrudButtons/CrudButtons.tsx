import { useTranslation } from 'react-i18next';
import { IconButton } from '~/Components';
import { KEY } from '~/i18n/constants';
import { COLORS } from '~/types';
import styles from './CrudButtons.module.scss';

type CrudButtonsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export function CrudButtons({ onEdit, onDelete }: CrudButtonsProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.row}>
      {onEdit && <IconButton onClick={onEdit} color={COLORS.blue} title={t(KEY.common_edit)} icon="mdi:pencil" />}
      {onDelete && <IconButton onClick={onDelete} color={COLORS.red} title={t(KEY.common_delete)} icon="mdi:bin" />}
    </div>
  );
}
