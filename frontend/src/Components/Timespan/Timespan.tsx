import { useTranslation } from 'react-i18next';
import { InputField } from '../InputField';
import styles from './Timespan.module.scss';
import { TimespanDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { TimeDuration } from '../TimeDuration';
import { startTransition, useContext, useEffect, useState } from 'react';
import { SamfFormField, useSamfForm } from '~/Forms/SamfFormField';
import { SamfFormContext } from '~/Forms/SamfForm';


export type TimespanTypes = 'date';

interface TimespanProps {
  type: TimespanTypes;
  start_field?: string;
  start_value?: string;
  end_field?: string;
  end_value?: string;
}

export function Timespan({ start_field = 'start_dt', end_field = 'end_dt' }: TimespanProps) {
  const { state, dispatch } = useContext(SamfFormContext);

  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();

  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();

  useEffect(() => {
    let start = new Date(startDate + ' ' + startTime);
    let end = new Date(startDate + ' ' + endTime);
    console.log(start);
    console.log(end);
    if (start) {
      setStart(start.toString());
    }
    if (end) {
      setEnd(end.toString());
    }
  }, [startDate, endDate, startTime, endTime]);

  useEffect(() => {
    console.log("startval "+ start);
    console.log("endval "+ end);
    if (state === undefined || dispatch === undefined) {
      return;
    }
    
    dispatch?.({
      field: start_field,
      value: start,
      error: false,
    });
    dispatch?.({
      field: end_field,
      value: end,
      error: false,
    });
  }, [end, start]);

  return (
    <div className={styles.timespan_line}>
      <InputField type="date" inputClassName={styles.timespan_field} onChange={setStartDate} value={startDate} >
        {t(KEY.common_date)}
      </InputField>
      <InputField type="time" inputClassName={styles.timespan_field} onChange={setStartTime} value={startTime}>
        {t(KEY.common_from)}
      </InputField>
      <InputField type="time" inputClassName={styles.timespan_field} onChange={setEndTime} value={endTime}>
        {t(KEY.common_to)}
      </InputField>
    </div>
  );
}
