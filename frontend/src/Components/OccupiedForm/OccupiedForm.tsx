import { useEffect, useMemo, useState } from 'react';
import { OccupiedTimeSlotDto } from '~/dto';
import styles from './OccupiedForm.module.scss';
import { KEY } from '~/i18n/constants';
import { toast } from 'react-toastify';
import { getOccupiedTimeslots, postOccupiedTimeslots } from '~/api';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { MiniCalendar } from '~/Components';
import { format } from 'date-fns';
import classNames from 'classnames';
import { lowerCapitalize } from '~/utils';
import { CalendarMarker } from '~/Components/MiniCalendar/MiniCalendar';

type OccupiedFormProps = {
  recruitmentId: number;
  onCancel?: () => void;
};

export function OccupiedForm({ recruitmentId = 1, onCancel }: OccupiedFormProps) {
  const { t } = useTranslation();
  const [occupiedTimeslots, setOccupiedTimeslots] = useState<OccupiedTimeSlotDto[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [baseDate] = useState(new Date('2024-01-12'));
  const [minDate] = useState(new Date('2024-01-16'));
  const [maxDate] = useState(new Date('2024-01-24'));

  const onDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

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
        toast.success(t(KEY.common_update_successful));
        setOccupiedTimeslots(res.data);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }
  const [timeslots] = useState(['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00']);

  const [selectedTimeslots, setSelectedTimeslots] = useState<Record<string, string[]>>({});

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

  const toggleTimeslot = (d: Date, timeslot: string) => {
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
  };

  useEffect(() => {
    console.log(selectedTimeslots);
  }, [selectedTimeslots]);

  const formatDate = (d: Date) => format(d, 'yyyy.LL.dd');

  const isTimeslotSelected = (d: Date, timeslot: string) => {
    const x = selectedTimeslots[formatDate(d)];
    return !(!x || !x.find((s) => s === timeslot));
  };

  const isAllSelected = (d: Date) => {
    const selectedLength = selectedTimeslots[formatDate(d)]?.length || 0;
    return selectedLength === timeslots.length;
  };

  const toggleSelectAll = (d: Date) => {
    const slots = { ...selectedTimeslots };
    if (isAllSelected(d)) {
      delete slots[formatDate(d)];
    } else {
      slots[formatDate(d)] = timeslots;
    }
    setSelectedTimeslots(slots);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t(KEY.occupied_title)}</h3>
      <span className={styles.subtitle}>
        <Trans i18nKey={KEY.occupied_help_text} />
      </span>
      <div className={styles.date_container}>
        <MiniCalendar
          minDate={minDate}
          maxDate={maxDate}
          baseDate={baseDate}
          onChange={onDateChange}
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
                    className={`${styles.timeslot} ${isTimeslotSelected(selectedDate, slot) && styles.timeslot_active}`}
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
        <Button display="block" theme="samf" onClick={() => sendTimeslots()}>
          {t(KEY.common_save)}
        </Button>
      </div>

      {/*<div>*/}
      {/*  <h3 className={styles.occupiedHeader}>{t(KEY.occupied_title)}</h3>*/}
      {/*  <small className={styles.occupiedText}>*/}
      {/*    <Trans i18nKey={KEY.occupied_help_text} />*/}
      {/*  </small>*/}
      {/*</div>*/}
      {/*<div className={styles.formContainer}>*/}
      {/*  {occupiedTimeslots?.map((element, index) => (*/}
      {/*    <OccupiedLine*/}
      {/*      timeslot={element}*/}
      {/*      index={index}*/}
      {/*      key={index}*/}
      {/*      onDelete={deleteTimeslot}*/}
      {/*      onChange={updateTimeslots}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</div>*/}
      {/*<div className={styles.row}>*/}
      {/*  <Button display="block" theme="green" onClick={() => sendTimeslots()}>*/}
      {/*    {t(KEY.common_save)}*/}
      {/*  </Button>*/}
      {/*  <Button className={styles.add} theme="blue" onClick={() => createTimeSlot()}>*/}
      {/*    <Icon icon="mdi:plus"></Icon>*/}
      {/*  </Button>*/}
      {/*</div>*/}
    </div>
  );
}
