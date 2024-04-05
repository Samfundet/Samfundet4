import { useEffect, useMemo, useState } from 'react';
import { OccupiedTimeslotDto } from '~/dto';
import styles from './OccupiedForm.module.scss';
import { KEY } from '~/i18n/constants';
import { toast } from 'react-toastify';
import { getOccupiedTimeslots, getRecruitmentAvailability, postOccupiedTimeslots } from '~/api';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { MiniCalendar } from '~/Components';
import { format } from 'date-fns';
import classNames from 'classnames';
import { lowerCapitalize } from '~/utils';
import { CalendarMarker } from '~/types';

type OccupiedFormProps = {
  recruitmentId: number;
  onCancel?: () => void;
};

export function OccupiedForm({ recruitmentId = 1, onCancel }: OccupiedFormProps) {
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
      getRecruitmentAvailability(recruitmentId)
        .then((response) => {
          if (!response.data) {
            toast.error(t(KEY.common_something_went_wrong));
            return;
          }
          setMinDate(new Date(response.data.start_date));
          setMaxDate(new Date(response.data.end_date));
          setTimeslots(response.data.timeslots);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        }),
      getOccupiedTimeslots(recruitmentId)
        .then((res) => {
          setSelectedTimeslots(res.data.dates);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        }),
    ]).finally(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId]);

  function save() {
    const data: OccupiedTimeslotDto = {
      recruitment: recruitmentId,
      dates: selectedTimeslots,
    };

    postOccupiedTimeslots(data)
      .then(() => {
        toast.success(t(KEY.common_update_successful));
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
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

  function toggleTimeslot(d: Date, timeslot: string) {
    const dayString = formatDate(d);
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

  function formatDate(d: Date) {
    return format(d, 'yyyy.LL.dd');
  }

  function isTimeslotSelected(d: Date, timeslot: string) {
    const x = selectedTimeslots[formatDate(d)];
    return !(!x || !x.find((s) => s === timeslot));
  }

  function isAllSelected(d: Date) {
    const selectedLength = selectedTimeslots[formatDate(d)]?.length || 0;
    return selectedLength === timeslots.length;
  }

  function toggleSelectAll(d: Date) {
    const slots = { ...selectedTimeslots };
    if (isAllSelected(d)) {
      delete slots[formatDate(d)];
    } else {
      slots[formatDate(d)] = timeslots;
    }
    setSelectedTimeslots(slots);
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t(KEY.occupied_title)}</h3>

      {loading ? (
        <span className={styles.subtitle}>{t(KEY.common_loading)}...</span>
      ) : (
        <>
          <span className={styles.subtitle}>
            <Trans i18nKey={KEY.occupied_help_text} />
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

            <div className={styles.timeslot_container}>
              {selectedDate ? (
                <>
                  {t(KEY.occupied_select_time_text)}:
                  <div className={styles.timeslots}>
                    {timeslots.map((slot) => (
                      <button
                        className={`${styles.timeslot} ${
                          isTimeslotSelected(selectedDate, slot) && styles.timeslot_active
                        }`}
                        key={slot}
                        onClick={() => toggleTimeslot(selectedDate, slot)}
                      >
                        <div className={styles.dot}></div>
                        <span>{slot}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    className={classNames({
                      [styles.timeslot]: true,
                      [styles.timeslot_active]: isAllSelected(selectedDate),
                    })}
                    onClick={() => toggleSelectAll(selectedDate)}
                  >
                    {isAllSelected(selectedDate) ? t(KEY.common_unselect_all) : t(KEY.common_select_all)}
                  </button>
                </>
              ) : (
                <div>{lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.common_date)}`)}</div>
              )}
            </div>
          </div>

          <div className={styles.button_row}>
            <Button display="block" theme="secondary" onClick={() => onCancel && onCancel()}>
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
