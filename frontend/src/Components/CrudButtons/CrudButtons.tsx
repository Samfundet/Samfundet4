import { Icon } from '@iconify/react';
import classNames from 'classnames';
import styles from './CrudButtons.module.scss';

type CrudButtonsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export function CrudButtons({ onEdit, onDelete }: CrudButtonsProps) {
  function handleOnClickEdit(e?: React.MouseEvent<HTMLElement>) {
    e?.preventDefault();
    onEdit?.();
  }
  function handleOnClickDelete(e?: React.MouseEvent<HTMLElement>) {
    e?.preventDefault();
    onDelete?.();
  }

  return (
    <>
      <div className={styles.row}>
        {onEdit && (
          <button onClick={handleOnClickEdit} className={classNames(styles.crud_button, styles.blue)}>
            <Icon icon="mdi:pencil" />
          </button>
        )}
        {onDelete && (
          <button onClick={handleOnClickDelete} className={classNames(styles.crud_button, styles.red)}>
            <Icon icon="mdi:bin" />
          </button>
        )}
      </div>
    </>
  );
}
