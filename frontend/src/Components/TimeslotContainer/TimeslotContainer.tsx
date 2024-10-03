import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMouseDown } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { formatDateYMD, lowerCapitalize } from '~/utils';
import { TimeslotButton } from './components/TimeslotButton';
import styles from './TimeslotContainer.module.scss';

type Props = {
  selectedDate: Date | null;
  timeslots: string[];
  onChange?: (timeslots: Record<string, string[]>) => void;
  activeTimeslots?: Record<string, string[]>; //De røde timeslotsene ( "occupied" )
  selectedTimeslot?: Record<string, string[]>; //Den ene grønne timesloten ( "selected" )
  disabledTimeslots?: Record<string, string[]>; //De grå timeslotsene ( "disabled" )
  selectMultiple: boolean;
  hasDisabledTimeslots: boolean;
};

export function TimeslotContainer({
  selectedDate,
  timeslots,
  onChange,
  selectMultiple,
  hasDisabledTimeslots,
  ...props
}: Props) {
  const { t } = useTranslation();

  const [activeTimeslots, setActiveTimeslots] = useState<Record<string, string[]>>(props.activeTimeslots || {});
  const [disabledTimeslots, setDisabledTimeslots] = useState<Record<string, string[]>>(props.disabledTimeslots || {});
  const [selectedTimeslot, setSelectedTimeslot] = useState<Record<string, string[]>>(props.selectedTimeslot || {});

  // Click & drag functionality
  const mouseDown = useMouseDown();
  // dragSetSelected decides whether we select or unselect buttons we drag over
  const [dragSetSelected, setDragSetSelected] = useState(false);

  useEffect(() => {
    if (!selectMultiple) {
      if (selectedDate && selectedTimeslot[formatDateYMD(selectedDate)]) {
        onChange?.(selectedTimeslot);
      }
    } else {
      onChange?.(activeTimeslots);
    }
  }, [onChange, activeTimeslots, selectedTimeslot, selectedDate, selectMultiple]);

  function toggleTimeslot(date: Date, timeslot: string) {
    if (hasDisabledTimeslots && disabledTimeslots) {
      if (disabledTimeslots[formatDateYMD(date)]?.includes(timeslot)) return;
    }
    if (!selectMultiple) {
      if (isTimeslotSelected(date, timeslot)) {
        setSelectedTimeslot({ [formatDateYMD(date)]: [] });
      } else {
        setSelectedTimeslot({ [formatDateYMD(date)]: [timeslot] });
      }
    } else {
      const dayString = formatDateYMD(date);
      const copy = { ...activeTimeslots };
      if (activeTimeslots[dayString]) {
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
      setActiveTimeslots(copy);
    }
  }

  function selectTimeslot(date: Date, timeslot: string) {
    if (isTimeslotSelected(date, timeslot)) return;
    const dayString = formatDateYMD(date);
    const copy = { ...activeTimeslots };
    if (copy[dayString]) {
      copy[dayString].push(timeslot);
    } else {
      copy[dayString] = [timeslot];
    }
    setActiveTimeslots(copy);
  }

  function unselectTimeslot(date: Date, timeslot: string) {
    if (!isTimeslotSelected(date, timeslot)) return;
    const dayString = formatDateYMD(date);
    const copy = { ...activeTimeslots };
    copy[dayString] = copy[dayString].filter((s) => s !== timeslot);
    if (copy[dayString].length === 0) {
      delete copy[dayString];
    }
    setActiveTimeslots(copy);
  }

  function isTimeslotSelected(date: Date, timeslot: string) {
    const x = activeTimeslots[formatDateYMD(date)];
    return x ? x.includes(timeslot) : false;
  }

  function isTimeslotDisabled(date: Date, timeslot: string) {
    if (!disabledTimeslots) return;
    const x = disabledTimeslots[formatDateYMD(date)];
    return x ? x.includes(timeslot) : false;
  }

  function isOnlyTimeSlot(date: Date, timeslot: string) {
    if (!selectedTimeslot || selectMultiple) return;
    return selectedTimeslot[formatDateYMD(date)]?.includes(timeslot);
  }

  function isAllSelected(date: Date) {
    const selectedLength = activeTimeslots[formatDateYMD(date)]?.length || 0;
    return selectedLength === timeslots.length;
  }

  function toggleSelectAll(date: Date) {
    const slots = { ...activeTimeslots };
    if (isAllSelected(date)) {
      delete slots[formatDateYMD(date)];
    } else {
      slots[formatDateYMD(date)] = timeslots;
    }
    setActiveTimeslots(slots);
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
      {selectMultiple ? t(KEY.occupied_select_time_text) + ':' : t(KEY.recruitment_choose_interview_time) + ':'}
      <div className={styles.timeslots}>
        {timeslots.map((timeslot) => {
          const active = isTimeslotSelected(selectedDate, timeslot);
          const disabled = isTimeslotDisabled(selectedDate, timeslot);
          const onlyOneChosen = isOnlyTimeSlot(selectedDate, timeslot);

          return (
            <TimeslotButton
              key={timeslot}
              active={active}
              disabled={disabled || false}
              onMouseDown={() => {
                toggleTimeslot(selectedDate, timeslot);
                setDragSetSelected(!active);
              }}
              onMouseEnter={() => onMouseEnter(selectedDate, timeslot)}
              onlyOneValid={onlyOneChosen}
            >
              {timeslot}
            </TimeslotButton>
          );
        })}
      </div>
      {selectMultiple && (
        <TimeslotButton
          active={isAllSelected(selectedDate)}
          disabled={false}
          onClick={() => toggleSelectAll(selectedDate)}
          showDot={false}
        >
          {isAllSelected(selectedDate) ? t(KEY.common_unselect_all) : t(KEY.common_select_all)}
        </TimeslotButton>
      )}
    </div>
  );
}
