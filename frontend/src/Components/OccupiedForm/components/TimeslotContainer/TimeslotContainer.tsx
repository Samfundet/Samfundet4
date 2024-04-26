import styles from './TimeslotContainer.module.scss';
import { formatDateYMD, lowerCapitalize } from '~/utils';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { TimeslotButton } from '~/Components/OccupiedForm/components';
import { useEffect, useState } from 'react';

type Props = {
  selectedDate: Date | null;
  timeslots: string[];
  onChange?: (timeslots: Record<string, string[]>) => void;
};

export function TimeslotContainer({ selectedDate, timeslots, onChange }: Props) {
  const { t } = useTranslation();

  const [selectedTimeslots, setSelectedTimeslots] = useState<Record<string, string[]>>({});

  useEffect(() => {
    onChange?.(selectedTimeslots);
  }, [selectedTimeslots]);

  function toggleTimeslot(d: Date, timeslot: string) {
    const dayString = formatDateYMD(d);
    const selectedTimeslotsCopy = { ...selectedTimeslots };
    if (selectedTimeslots[dayString]) {
      if (selectedTimeslotsCopy[dayString].includes(timeslot)) {
        selectedTimeslotsCopy[dayString] = selectedTimeslotsCopy[dayString].filter((s) => s !== timeslot);
        if (selectedTimeslotsCopy[dayString].length === 0) {
          delete selectedTimeslotsCopy[dayString];
        }
      } else {
        selectedTimeslotsCopy[dayString].push(timeslot);
      }
    } else {
      selectedTimeslotsCopy[dayString] = [timeslot];
    }
    setSelectedTimeslots(selectedTimeslotsCopy);
  }

  function isTimeslotSelected(d: Date, timeslot: string) {
    const x = selectedTimeslots[formatDateYMD(d)];
    return !(!x || !x.find((s) => s === timeslot));
  }

  function isAllSelected(d: Date) {
    const selectedLength = selectedTimeslots[formatDateYMD(d)]?.length || 0;
    return selectedLength === timeslots.length;
  }

  function toggleSelectAll(d: Date) {
    const slots = { ...selectedTimeslots };
    if (isAllSelected(d)) {
      delete slots[formatDateYMD(d)];
    } else {
      slots[formatDateYMD(d)] = timeslots;
    }
    setSelectedTimeslots(slots);
  }

  if (!selectedDate) {
    return <div className={styles.container}>{lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.common_date)}`)}</div>;
  }

  return (
    <div className={styles.container}>
      {t(KEY.occupied_select_time_text)}:
      <div className={styles.timeslots}>
        {timeslots.map((timeslot) => (
          <TimeslotButton
            key={timeslot}
            active={isTimeslotSelected(selectedDate, timeslot)}
            onClick={() => toggleTimeslot(selectedDate, timeslot)}
          >
            {timeslot}
          </TimeslotButton>
        ))}
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
