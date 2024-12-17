import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TimeslotButton } from '~/Components';
import { useMouseDown } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { formatDateYMD, lowerCapitalize } from '~/utils';
import styles from './TimeslotSelector.module.scss';

type Props = {
  selectedDate: Date | null;
  timeslots: string[];
  onChange?: (timeslots: Record<string, string[]>) => void;

  selectedTimeslots?: Record<string, string[]>; // Selected timeslots
  disabledTimeslots?: Record<string, string[]>; // Timeslots which can't be selected

  selectMultiple?: boolean;
  readOnly?: boolean;
  label?: string;
};

export function TimeslotSelector({
  selectedDate,
  timeslots,
  onChange,
  selectMultiple,
  disabledTimeslots,
  readOnly,
  label,
  ...props
}: Props) {
  const { t } = useTranslation();

  const [selectedTimeslots, setSelectedTimeslots] = useState<Record<string, string[]>>(props.selectedTimeslots || {});

  // Click & drag functionality
  const mouseDown = useMouseDown();
  // dragSetSelected decides whether we select or unselect buttons we drag over
  const [dragSetSelected, setDragSetSelected] = useState(false);

  useEffect(() => {
    console.log(selectedTimeslots);
    onChange?.(selectedTimeslots);
  }, [onChange, selectedTimeslots]);

  function toggleTimeslot(date: Date, timeslot: string) {
    if (disabledTimeslots?.[formatDateYMD(date)]?.includes(timeslot)) {
      return;
    }
    if (!selectMultiple) {
      const selected = isTimeslotSelected(date, timeslot);
      setSelectedTimeslots(selected ? {} : { [formatDateYMD(date)]: [timeslot] });
      return;
    }
    const dayString = formatDateYMD(date);
    const copy = { ...selectedTimeslots };
    if (selectedTimeslots[dayString]) {
      if (copy[dayString].includes(timeslot)) {
        copy[dayString] = copy[dayString].filter((s) => s !== timeslot);
        if (copy[dayString].length === 0) {
          delete copy[dayString];
        }
      } else {
        copy[dayString].push(timeslot);
      }
    } else {
      copy[dayString] = [timeslot];
    }
    setSelectedTimeslots(copy);
  }

  function selectTimeslot(date: Date, timeslot: string) {
    if (isTimeslotSelected(date, timeslot)) {
      return;
    }
    const dayString = formatDateYMD(date);
    const copy = { ...selectedTimeslots };
    if (copy[dayString]) {
      copy[dayString].push(timeslot);
    } else {
      copy[dayString] = [timeslot];
    }
    setSelectedTimeslots(copy);
  }

  function unselectTimeslot(date: Date, timeslot: string) {
    if (!isTimeslotSelected(date, timeslot)) {
      return;
    }
    const dayString = formatDateYMD(date);
    const copy = { ...selectedTimeslots };
    copy[dayString] = copy[dayString].filter((s) => s !== timeslot);
    if (copy[dayString].length === 0) {
      delete copy[dayString];
    }
    setSelectedTimeslots(copy);
  }

  function isTimeslotIn(list: Record<string, string[]> | undefined, date: Date, timeslot: string): boolean {
    return list?.[formatDateYMD(date)]?.includes(timeslot) || false;
  }

  function isTimeslotSelected(date: Date, timeslot: string) {
    return isTimeslotIn(selectedTimeslots, date, timeslot);
  }

  function isTimeslotDisabled(date: Date, timeslot: string) {
    return isTimeslotIn(disabledTimeslots, date, timeslot);
  }

  function isAllSelected(date: Date) {
    const selectedLength = selectedTimeslots[formatDateYMD(date)]?.length || 0;
    return selectedLength === timeslots.length;
  }

  function toggleSelectAll(date: Date) {
    const slots = { ...selectedTimeslots };
    if (isAllSelected(date)) {
      delete slots[formatDateYMD(date)];
    } else {
      slots[formatDateYMD(date)] = timeslots;
    }
    setSelectedTimeslots(slots);
  }

  function onMouseEnter(date: Date, timeslot: string) {
    if (!mouseDown || !selectMultiple) return;
    if (dragSetSelected) {
      selectTimeslot(date, timeslot);
    } else {
      unselectTimeslot(date, timeslot);
    }
  }

  if (!selectedDate) {
    return <div className={styles.container}>{lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.common_date)}`)}</div>;
  }

  return (
    <div className={styles.container}>
      {label}
      <div className={styles.timeslots}>
        {timeslots.map((timeslot) => {
          const selected = isTimeslotSelected(selectedDate, timeslot);
          const disabled = isTimeslotDisabled(selectedDate, timeslot);

          return (
            <TimeslotButton
              key={timeslot}
              active={selected}
              disabled={disabled}
              readOnly={readOnly}
              onMouseDown={(event) => {
                if (event.button !== 0 || readOnly) {
                  // Ignore if not primary mouse button
                  return;
                }
                toggleTimeslot(selectedDate, timeslot);
                setDragSetSelected(!selected);
              }}
              onMouseEnter={() => onMouseEnter(selectedDate, timeslot)}
              onKeyDown={(event) => {
                if (readOnly || (event.key !== ' ' && event.key !== 'Enter')) return;
                toggleTimeslot(selectedDate, timeslot);
              }}
              aria-pressed={selected}
            >
              {timeslot}
            </TimeslotButton>
          );
        })}
      </div>
      {selectMultiple && !readOnly && (
        <TimeslotButton active={isAllSelected(selectedDate)} onClick={() => toggleSelectAll(selectedDate)}>
          {isAllSelected(selectedDate) ? t(KEY.common_unselect_all) : t(KEY.common_select_all)}
        </TimeslotButton>
      )}
    </div>
  );
}
