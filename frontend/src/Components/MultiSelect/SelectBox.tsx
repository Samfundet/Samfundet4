import { Button } from '~/Components';
import type { ButtonTheme } from '~/Components/Button';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import styles from './SelectBox.module.scss';

type Props<T> = {
  items: DropdownOption<T>[];
  label?: string;
  onItemClick?: (item: DropdownOption<T>) => void;
  itemButtonTheme?: ButtonTheme;
  loading?: boolean;
  emptyMessage?: string;
};

export function SelectBox<T>({
  items,
  label,
  onItemClick,
  itemButtonTheme = 'samf',
  loading = false,
  emptyMessage,
}: Props<T>) {
  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.box}>
        <div className={styles.inner}>
          {loading ? (
            <div className={styles.message}>Loading...</div>
          ) : items.length > 0 ? (
            items.map((item, i) => (
              <Button
                type="button"
                // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
                key={i}
                onClick={() => onItemClick?.(item)}
                theme={itemButtonTheme}
                className={styles.button}
              >
                {item.label}
              </Button>
            ))
          ) : (
            emptyMessage && <div className={styles.message}>{emptyMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}
