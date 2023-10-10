import { ChangeEvent, useState } from 'react';
import styles from './InputTime.module.scss';

type InputTimeProps = {
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  placeholder?: string | null;
  value?: string;
};

export function InputTime({ onChange, onBlur, placeholder, value }: InputTimeProps) {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const inputName = e.target.getAttribute('name');
    const inputTime = e.target.value;
    // Remove non-numeric characters
    let numericValue = e.target.value.replace(/[^0-9]/g, '');

    const parsedValue = parseInt(numericValue, 10);

    if (inputName === 'hour') {
      if (!isNaN(parsedValue) && parsedValue >= 0) {
        numericValue = Math.min(23, parsedValue).toString();
      } else {
        numericValue = '';
      }
      setHour(numericValue);
    } else if (inputName === 'minute') {
      if (!isNaN(parsedValue) && parsedValue >= 0) {
        numericValue = Math.min(59, parsedValue).toString();
      } else {
        numericValue = '';
      }
      setMinute(numericValue);
    }

    onChange?.(`${hour}:${minute}`);
    onChange?.(inputTime);
  }

  return (
    <div className={styles.inputTime_wrap}>
      <div className={styles.inputTime}>
        <input
          type="text"
          className={styles.number}
          name="hour"
          placeholder={placeholder || '12'}
          value={hour}
          onChange={handleChange}
          onBlur={() => onBlur?.(hour)}
        />
        <p>:</p>
        <input
          type="text"
          className={styles.number}
          name="minute"
          placeholder={placeholder || '00'}
          value={minute}
          onChange={handleChange}
          onBlur={() => onBlur?.(minute)}
        />
      </div>
      <div className={styles.error}></div>
    </div>
  );
}
