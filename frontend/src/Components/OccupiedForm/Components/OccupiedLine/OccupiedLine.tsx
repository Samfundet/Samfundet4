import { useEffect, useState } from 'react';
import { OccupiedTimeSlotDto } from '~/dto';
import styles from './OccupiedLine.module.scss';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { COLORS } from '~/types';
import { formatDate, formatTime } from '../../utils';
import { InputTime } from '~/Components/InputTime';
import { InputField } from '~/Components/InputField';
import { IconButton } from '~/Components/IconButton';

type OccupiedLineProps = {
  timeslot: OccupiedTimeSlotDto;
  onChange: (key: number, newTimeslot: OccupiedTimeSlotDto) => void;
  onDelete: (key: number) => void;
  index: number;
};

export function OccupiedLine({ timeslot, onChange, onDelete, index }: OccupiedLineProps) {
  const { t } = useTranslation();

  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  const [dateError, setDateError] = useState<string>('');
  const [startTimeError, setStartTimeError] = useState<string>('');
  const [endTimeError, setEndTimeError] = useState<string>('');

  useEffect(() => {
    const startDt = new Date(timeslot.start_dt);
    const endDt = new Date(timeslot.end_dt);
    if (!isNaN(startDt.getTime())) {
      // Tests for valid date
      setDate(formatDate(startDt)); // Fetch date format
      setStartTime(formatTime(startDt)); // Fetch time
    }
    if (!isNaN(startDt.getTime())) {
      // If valid endtime
      setEndTime(formatTime(endDt)); // Fetch time
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Check error if empty
    setDateError(date.length === 0 ? t(KEY.common_required) : '');
    setEndTimeError(endTime.length === 0 ? t(KEY.common_required) : '');
    setStartTimeError(startTime.length === 0 ? t(KEY.common_required) : '');
    if (date.length > 0 && endTime.length > 0 && startTime.length > 0) {
      // Create Date from start and endTime
      const startDt = new Date(date + ' ' + startTime);
      const endDt = new Date(date + ' ' + endTime);
      if (!(isNaN(startDt.getTime()) && !isNaN(endDt.getTime())) && endDt.getTime() < startDt.getTime()) {
        setEndTimeError('Time must be after start');
        endDt.setDate(endDt.getDate() + 1);
      }
      const startDtString = !isNaN(startDt.getTime()) ? startDt.toISOString() : timeslot.start_dt;
      const endDtString = !isNaN(endDt.getTime()) ? endDt.toISOString() : timeslot.end_dt;
      const newTimeSlot = { ...timeslot, start_dt: startDtString, end_dt: endDtString };
      onChange(index, newTimeSlot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, startTime, endTime]);

  return (
    <div className={styles.background}>
      <div className={styles.row}>
        <InputField type="date" value={date} onChange={setDate} error={dateError} />
        <InputTime value={startTime} onChange={setStartTime} error={startTimeError} />
        -
        <InputTime value={endTime} onChange={setEndTime} error={endTimeError} />
        <div>
          <IconButton onClick={() => onDelete(index)} color={COLORS.red} title={t(KEY.common_delete)} icon="mdi:bin" />
        </div>
      </div>
    </div>
  );
}
