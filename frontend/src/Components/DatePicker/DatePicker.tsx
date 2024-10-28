import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, MiniCalendar } from '~/Components';
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

export function DatePicker({
  value: initialValue,
  onChange,
  disabled,
  buttonClassName,
  minDate,
  maxDate,
  ...props
}: DatePickerProps) {
  const isControlled = initialValue !== undefined;

  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

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
    <div>
      <Button
        type="button"
        className={classNames(styles.button, buttonClassName)}
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
      >
        <Icon icon="material-symbols:calendar-month-outline-rounded" />
        {value ? format(value, 'PPP') : <span>{t(KEY.pick_a_date)}</span>}
      </Button>
      <div className={classNames(!open && styles.hidden)}>
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
}
