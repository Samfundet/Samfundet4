import { useTranslation } from 'react-i18next';
import { IconButton } from '~/Components';
import type { IconButtonSize } from '~/Components/IconButton';
import { KEY } from '~/i18n/constants';
import { COLORS } from '~/types';
import styles from './CrudButtons.module.scss';

type Action = (() => void) | string | false;
type ActionKey = 'onView' | 'onEdit' | 'onManage' | 'onCopy' | 'onDelete';
type ButtonConfig = { title: string; color: string; icon: string };

type CrudButtonsProps = Partial<Record<ActionKey, Action>> & {
  size?: IconButtonSize;
};

export function CrudButtons({ size = 'md', ...actions }: CrudButtonsProps) {
  const { t } = useTranslation();

  const BUTTONS: Record<ActionKey, ButtonConfig> = {
    onView: {
      title: t(KEY.common_show),
      color: COLORS.green,
      icon: 'ic:baseline-remove-red-eye',
    },
    onEdit: {
      title: t(KEY.common_edit),
      color: COLORS.blue,
      icon: 'mdi:pencil',
    },
    onManage: {
      title: t(KEY.common_manage),
      color: COLORS.turquoise,
      icon: 'ic:baseline-dashboard',
    },
    onCopy: {
      title: t(KEY.common_copy),
      color: COLORS.grey_3,
      icon: 'mdi:content-copy',
    },
    onDelete: {
      title: t(KEY.common_delete),
      color: COLORS.red,
      icon: 'mdi:bin',
    },
  };

  return (
    <div className={styles.row}>
      {(Object.entries(BUTTONS) as [ActionKey, ButtonConfig][]).map(([key, values]) => {
        const action = actions[key];

        if (!action) {
          return null;
        }

        return (
          <IconButton
            {...(typeof action === 'string' ? { url: action } : { onClick: action })}
            {...values}
            key={key}
            size={size}
          />
        );
      })}
    </div>
  );
}
