import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from './ToggleSwitch.module.scss';

type ToggleSwitchProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>;

export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(function ToggleSwitch(
  { className, ...props },
  ref,
) {
  return (
    <div className={className}>
      <label className={styles.label}>
        <input className={styles.toggle_switch} type="checkbox" ref={ref} {...props} />
        <span className={styles.track}>
          <span className={styles.ball} />
        </span>
      </label>
    </div>
  );
});
