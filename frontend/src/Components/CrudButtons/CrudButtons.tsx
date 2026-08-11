import { useTranslation } from 'react-i18next';
import { IconButton } from '~/Components';
import { KEY } from '~/i18n/constants';
import { COLORS } from '~/types';
import styles from './CrudButtons.module.scss';

type CrudButtonsProps = {
  onView?: (() => void) | string | false;
  onManage?: (() => void) | string | false;
  onEdit?: (() => void) | string | false;
  onDelete?: (() => void) | string | false;
};

export function CrudButtons({ onView, onEdit, onManage, onDelete }: CrudButtonsProps) {
  const { t } = useTranslation();

  function createButton(title: string, color: string, icon: string, action?: (() => void) | string | false) {
    if (!action) {
      return null;
    }
    const props = typeof action === 'string' ? { url: action } : { onClick: action };
    return <IconButton {...props} color={color} title={title} icon={icon} />;
  }

  return (
    <div className={styles.row}>
      {createButton(t(KEY.common_manage), COLORS.turquoise, 'ic:baseline-dashboard', onManage)}
      {createButton(t(KEY.common_show), COLORS.green, 'ic:baseline-remove-red-eye', onView)}
      {createButton(t(KEY.common_edit), COLORS.blue, 'mdi:pencil', onEdit)}
      {createButton(t(KEY.common_delete), COLORS.red, 'mdi:bin', onDelete)}
    </div>
  );
}
