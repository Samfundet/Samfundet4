import styles from './TimeslotContainer.module.scss';
import { formatDateYMD, lowerCapitalize } from '~/utils';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { TimeslotButton } from '~/Components/OccupiedForm/components';
import { useEffect, useState } from 'react';
import { useMouseDown } from '~/hooks';

type Props = {
  selectedDate: Date | null;
  timeslots: string[];
  onChange?: (timeslots: Record<string, string[]>) => void;
  selectedTimeslots?: Record<string, string[]>;
};

export function TimeslotContainer({ selectedDate, timeslots, onChange, ...props }: Props) {
  const { t } = useTranslation();

  const [selectedTimeslots, setSelectedTimeslots] = useState<Record<string, string[]>>(props.selectedTimeslots || {});

  // Click & drag functionality
  const mouseDown = useMouseDown();
  // dragSetSelected decides whether we select or unselect buttons we drag over
  const [dragSetSelected, setDragSetSelected] = useState(false);

  useEffect(() => {
    onChange?.(selectedTimeslots);
  }, [onChange, selectedTimeslots]);

  function toggleTimeslot(date: Date, timeslot: string) {
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
    if (isTimeslotSelected(date, timeslot)) return;
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
    if (!isTimeslotSelected(date, timeslot)) return;
    const dayString = formatDateYMD(date);
    const copy = { ...selectedTimeslots };
    copy[dayString] = copy[dayString].filter((s) => s !== timeslot);
    if (copy[dayString].length === 0) {
      delete copy[dayString];
    }
    setSelectedTimeslots(copy);
  }

  function isTimeslotSelected(date: Date, timeslot: string) {
    const x = selectedTimeslots[formatDateYMD(date)];
    return !(!x || !x.find((s) => s === timeslot));
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
    if (!mouseDown) return;
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
      {t(KEY.occupied_select_time_text)}:
      <div className={styles.timeslots}>
        {timeslots.map((timeslot) => {
          const active = isTimeslotSelected(selectedDate, timeslot);

          return (
            <TimeslotButton
              key={timeslot}
              active={active}
              onMouseDown={() => {
                toggleTimeslot(selectedDate, timeslot);
                setDragSetSelected(!active);
              }}
              onMouseEnter={() => onMouseEnter(selectedDate, timeslot)}
            >
              {timeslot}
            </TimeslotButton>
          );
        })}
      </div>
      <TimeslotButton
        active={isAllSelected(selectedDate)}
        onClick={() => toggleSelectAll(selectedDate)}
        showDot={false}
      >
        {isAllSelected(selectedDate) ? t(KEY.common_unselect_all) : t(KEY.common_select_all)}
      </TimeslotButton>
    </div>
  );
}
