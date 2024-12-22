import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { format } from 'date-fns';
import { forwardRef, useMemo } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MiniCalendar } from '~/Components';
import { useClickOutside } from '~/hooks';
import { KEY } from '~/i18n/constants';
import styles from './DatePicker.module.scss';

type DatePickerProps = {
  label?: string;
  disabled?: boolean;
  value?: Date | null;
  buttonClassName?: string;
  onChange?: (date: Date | null) => void;
  className?: string;

  minDate?: Date;
  maxDate?: Date;
};

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ value: initialValue, onChange, disabled, label, buttonClassName, minDate, maxDate }, ref) => {
    const isControlled = initialValue !== undefined;

    const [date, setDate] = useState<Date | null>(null);
    const [open, setOpen] = useState(false);

    const { t } = useTranslation();

    const clickOutsideRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

    const value = useMemo(() => {
      if (isControlled) {
        return initialValue;
      }
      return date;
    }, [isControlled, initialValue, date]);

    function handleChange(d: Date | null) {
      setDate(d);
      onChange?.(d);
    }

    return (
      <div className={styles.container} ref={clickOutsideRef}>
        <button
          type="button"
          className={classNames(styles.button, buttonClassName)}
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
          ref={ref}
        >
          <Icon icon="material-symbols:calendar-month-outline-rounded" />
          {value ? format(value, 'PPP') : <span>{label ?? t(KEY.pick_a_date)}</span>}
        </button>
        <div className={classNames(styles.popover, !open && styles.hidden)}>
          <MiniCalendar
            baseDate={value || new Date()}
            onChange={handleChange}
            minDate={minDate}
            maxDate={maxDate}
            displayLabel
          />
        </div>
      </div>
    );
  },
);
DatePicker.displayName = 'DatePicker';
