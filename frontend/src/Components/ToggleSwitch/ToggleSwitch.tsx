import styles from './ToggleSwitch.module.scss';

type ToggleSwitchProps = {
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
};

export function ToggleSwitch({ className, checked, onChange, disabled }: ToggleSwitchProps) {
  return (
    <div className={className}>
      <label className={styles.label}>
        <input
          className={styles.toggle_switch}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
        />
        <span className={styles.track}>
          <span className={styles.ball} />
        </span>
      </label>
    </div>
  );
}
