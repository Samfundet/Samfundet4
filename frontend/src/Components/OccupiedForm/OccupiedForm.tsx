import { useEffect, useState } from 'react';
import { OccupiedTimeSlotDto } from '~/dto';
import styles from './OccupiedForm.module.scss';
import { KEY } from '~/i18n/constants';
import { toast } from 'react-toastify';
import { getOccupiedTimeslots, postOccupiedTimeslots } from '~/api';
import { useTranslation } from 'react-i18next';
import { InputField } from '../InputField';
import { Button } from '../Button';
import { COLORS } from '~/types';
import { IconButton } from '../IconButton';

type OccupiedFormProps = {
  recruitmentId: number;
};

type OccupiedLineProps = {
  timeslot: OccupiedTimeSlotDto;
  onChange: (key: number, newTimeslot: OccupiedTimeSlotDto) => void;
  onDelete: (key: number) => void;
  index: number;
};

function OccupiedLine({ timeslot, onChange, onDelete, index }: OccupiedLineProps) {
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
      setDate(startDt.toISOString().substring(0, 10));
      setStartTime(startDt.toLocaleTimeString('no-NO').substring(0, 5));
    }
    if (!isNaN(startDt.getTime())) setEndTime(endDt.toLocaleTimeString('no-NO').substring(0, 5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDateError(date.length === 0 ? t(KEY.common_required) : '');
    setEndTimeError(endTime.length === 0 ? t(KEY.common_required) : '');
    setStartTimeError(startTime.length === 0 ? t(KEY.common_required) : '');
    if (date.length > 0 && endTime.length > 0 && startTime.length > 0) {
      const startDt = new Date(date + ' ' + startTime);
      const endDt = new Date(date + ' ' + endTime);
      if (!(isNaN(startDt.getTime()) && !isNaN(endDt.getTime())) && endDt.getTime() < startDt.getTime()) {
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
    <div>
      <div className={styles.row}>
        <InputField type="date" value={date} onChange={setDate} error={dateError} />
        <InputField type="time" value={startTime} onChange={setStartTime} error={startTimeError} />
        <InputField type="time" value={endTime} onChange={setEndTime} error={endTimeError} />
        <div>
          <IconButton onClick={() => onDelete(index)} color={COLORS.red} title={t(KEY.common_delete)} icon="mdi:bin" />
        </div>
      </div>
    </div>
  );
}
export function OccupiedForm({ recruitmentId = 1 }: OccupiedFormProps) {
  const { t } = useTranslation();
  const [occupiedTimeslots, setOccupiedTimeslots] = useState<OccupiedTimeSlotDto[]>([]);

  useEffect(() => {
    if (recruitmentId) {
      getOccupiedTimeslots(recruitmentId)
        .then((res) => {
          setOccupiedTimeslots(res.data);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId]);

  function updateTimeslots(key: number, newTimeslot: OccupiedTimeSlotDto) {
    setOccupiedTimeslots(
      occupiedTimeslots.map((element: OccupiedTimeSlotDto, index: number) => {
        if (key === index) {
          return newTimeslot;
        } else {
          return element;
        }
      }),
    );
  }

  function deleteTimeslot(key: number) {
    setOccupiedTimeslots(occupiedTimeslots.filter((element: OccupiedTimeSlotDto, index: number) => key !== index));
  }

  function createTimeSlot() {
    setOccupiedTimeslots([...occupiedTimeslots, {} as OccupiedTimeSlotDto]);
  }

  function sendTimeslots() {
    postOccupiedTimeslots(
      occupiedTimeslots.map((element) => {
        return { ...element, recruitment: recruitmentId };
      }),
    )
      .then((res) => {
        setOccupiedTimeslots(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.occupiedHeader}>{t(KEY.occupied_title)}</h3>
        <small className={styles.occupiedText}>{t(KEY.occupied_help_text)}</small>
      </div>
      <div className={styles.formContainer}>
        {occupiedTimeslots?.map((element, index) => (
          <OccupiedLine
            timeslot={element}
            index={index}
            key={index}
            onDelete={deleteTimeslot}
            onChange={updateTimeslots}
          />
        ))}
      </div>
      <div className={styles.row}>
        <Button display="block" theme="green" onClick={() => sendTimeslots()}>
          {t(KEY.common_save)}
        </Button>
        <div className={styles.add}>
          <IconButton title="add" icon="mdi:plus" color="blue" onClick={() => createTimeSlot()} />
        </div>
      </div>
    </div>
  );
}
