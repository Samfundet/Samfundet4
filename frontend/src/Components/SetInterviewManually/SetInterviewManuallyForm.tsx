import { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getOccupiedTimeslots, getRecruitmentAvailability } from '~/api'; //postOccupiedTimeslots removed this
import { MiniCalendar, TimeslotContainer } from '~/Components';
// import { OccupiedTimeslotDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { CalendarMarker } from '~/types';
import { Button } from '../Button';
import styles from './SetInterviewManually.module.scss';

type Props = {
  recruitmentId: number;
  onCancel?: () => void;
};

export function SetInterviewManuallyForm({ recruitmentId = 1, onCancel }: Props) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [minDate, setMinDate] = useState(new Date('2024-01-16'));
  const [maxDate, setMaxDate] = useState(new Date('2024-01-24'));

  const [timeslots, setTimeslots] = useState<string[]>([]);
  const [selectedTimeslots, setSelectedTimeslots] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!recruitmentId) {
      return;
    }
    setLoading(true);

    Promise.allSettled([
      getRecruitmentAvailability(recruitmentId).then((response) => {
        if (!response.data) {
          toast.error(t(KEY.common_something_went_wrong));
          return;
        }
        setMinDate(new Date(response.data.start_date));
        setMaxDate(new Date(response.data.end_date));
        setTimeslots(response.data.timeslots);
      }),
      getOccupiedTimeslots(recruitmentId).then((res) => {
        setSelectedTimeslots(res.data.dates);
      }),
    ])
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId]);

  function save() {
    // const data: OccupiedTimeslotDto = {
    //   recruitment: recruitmentId,
    //   dates: selectedTimeslots,
    // };
    // postOccupiedTimeslots(data)
    //   .then(() => {
    //     toast.success(t(KEY.common_update_successful));
    //   })
    //   .catch((error) => {
    //     toast.error(t(KEY.common_something_went_wrong));
    //     console.error(error);
    //   });
  }

  const markers = useMemo(() => {
    const x: CalendarMarker[] = [];

    for (const d in selectedTimeslots) {
      if (selectedTimeslots[d]) {
        if (selectedTimeslots[d].length === timeslots.length) {
          x.push({
            date: new Date(d),
            className: styles.fully_busy,
          });
        } else if (selectedTimeslots[d].length > 0) {
          x.push({
            date: new Date(d),
            className: styles.partly_busy,
          });
        }
      }
    }
    return x;
  }, [timeslots, selectedTimeslots]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t(KEY.recruitment_interview_set)}</h3>

      {loading ? (
        <span className={styles.subtitle}>{t(KEY.common_loading)}...</span>
      ) : (
        <>
          <span className={styles.subtitle}>
            <Trans i18nKey={KEY.recruitment_choose_interview_time} />
          </span>
          <div className={styles.date_container}>
            <MiniCalendar
              minDate={minDate}
              maxDate={maxDate}
              baseDate={minDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              displayLabel={true}
              markers={markers}
            />

            <TimeslotContainer
              selectedDate={selectedDate}
              timeslots={timeslots}
              onChange={(slots) => setSelectedTimeslots(slots)}
              selectedTimeslots={selectedTimeslots}
            />
          </div>

          <div className={styles.button_row}>
            <Button display="block" theme="secondary" onClick={() => onCancel?.()}>
              {t(KEY.common_cancel)}
            </Button>
            <Button display="block" theme="samf" onClick={save}>
              {t(KEY.common_save)}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
