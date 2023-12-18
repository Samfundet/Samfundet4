import { useEffect, useState } from 'react';
import { OccupiedTimeSlotDto } from '~/dto';
import styles from './OccupiedForm.module.scss';
import { KEY } from '~/i18n/constants';
import { toast } from 'react-toastify';
import { getOccupiedTimeslots } from '~/api';
import { useTranslation } from 'react-i18next';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { InputField } from '../InputField';
type OccupiedFormProps = {
  recruitmentId: string;
};

type OccupiedLineProps = {
  timeslot: OccupiedTimeSlotDto;
  onChange: (key: number, newTimeslot: OccupiedTimeSlotDto) => void;
  index: number;
};

function OccupiedLine({ timeslot, onChange, index }: OccupiedLineProps) {
  const { t } = useTranslation();

  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  useEffect(() => {
    const startDt = new Date(timeslot.start_dt);
    const endDt = new Date(timeslot.start_dt);
    if (!isNaN(startDt.getTime())) {
      setDate(startDt.toISOString().substring(0, 10));
      setStartTime(startDt.toLocaleTimeString('no-NO'));
    }
    if (!isNaN(startDt.getTime())) setEndTime(endDt.toLocaleTimeString('no-NO'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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
      <div className={styles.occupied_line}>
        <InputField type="date" value={date} onChange={setDate}> {t(KEY.common_date)} </InputField>
        <InputField type="time" value={startTime} onChange={setStartTime} />
        <InputField type="time" value={endTime} onChange={setEndTime} />
      </div>
    </div>
  );
}
export function OccupiedForm({ recruitmentId = '1' }: OccupiedFormProps) {
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
    console.log(key);
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

  useEffect(() => {
    console.log(occupiedTimeslots);
  }, [occupiedTimeslots]);

  return (
    <div>
      {occupiedTimeslots?.map((element, index) => (
        <OccupiedLine timeslot={element} index={index} key={index} onChange={updateTimeslots} />
      ))}
    </div>
  );
}
