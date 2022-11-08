import styles from './ToggleSwitch.module.scss';

type ToggleSwitchProps = {
  className: string;
  checked?: boolean;
  offIcon?: string; // TODO: change later
  onIcon?: string; // TODO: change later
  disabled?: boolean;
  onClick: () => void;
};

export function ToggleSwitch({ className, checked, onClick, disabled, offIcon, onIcon }: ToggleSwitchProps) {
  return (
    <div className={className}>
      <label className={styles.label}>
        <input
          className={styles.toggle_switch}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onClick={onClick}
        />
        <span>{offIcon}</span>
        <span>{onIcon}</span>
        <span className={styles.ball} />
      </label>
    </div>
  );
}
