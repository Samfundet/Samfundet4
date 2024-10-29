import { Button } from '~/Components';
import type { ButtonTheme } from '~/Components/Button';
import type { DropDownOption } from '~/Components/Dropdown/Dropdown';
import styles from './SelectBox.module.scss';

type Props<T> = {
  items: DropDownOption<T>[];
  label?: string;
  onItemClick?: (item: DropDownOption<T>) => void;
  itemButtonTheme?: ButtonTheme;
};

export function SelectBox<T>({ items, label, onItemClick, itemButtonTheme = 'samf' }: Props<T>) {
  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.box}>
        <div className={styles.inner}>
          {items.map((item, i) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
