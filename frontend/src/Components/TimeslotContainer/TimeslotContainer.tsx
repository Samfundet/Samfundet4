import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMouseDown } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { formatDateYMD, lowerCapitalize } from '~/utils';
import { TimeslotButton } from '../TimeslotButton';

type Props = {
  selectedDate: Date | null;
  timeslots: string[];
  onChange?: (timeslots: Record<string, string[]>) => void;
  activeTimeslots?: Record<string, string[]>; //De røde timeslotsene ( "occupied" )
  selectedTimeslot?: string | null;
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
  const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);

  // Click & drag functionality
  const mouseDown = useMouseDown();
  // dragSetSelected decides whether we select or unselect buttons we drag over
  const [dragSetSelected, setDragSetSelected] = useState(false);

  useEffect(() => {
    if (!selectMultiple) {
      if (selectedTimeslot) {
        onChange?.({ [formatDateYMD(selectedDate!)]: [selectedTimeslot] });
      }
    } else {
      onChange?.(activeTimeslots);
    }
  }, [onChange, activeTimeslots, selectedTimeslot, selectedDate, selectMultiple]);

  function toggleTimeslot(date: Date, timeslot: string) {
    if (hasDisabledTimeslots && props.disabledTimeslots) {
      if (props.disabledTimeslots[formatDateYMD(date)]?.includes(timeslot)) return;
    }
    if (!selectMultiple) {
      setSelectedTimeslot(timeslot === selectedTimeslot ? null : timeslot);
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
    return !(!x || !x.find((s) => s === timeslot));
  }

  function isTimeslotDisabled(date: Date, timeslot: string) {
    if (!props.disabledTimeslots) return;
    const x = props.disabledTimeslots[formatDateYMD(date)];
    return !(!x || !x.find((s) => s === timeslot));
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
    if (!mouseDown || selectMultiple) return;
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
          const disabled = isTimeslotDisabled(selectedDate, timeslot);

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
            >
              {timeslot}
            </TimeslotButton>
          );
        })}
      </div>
      <TimeslotButton
        active={isAllSelected(selectedDate)}
        disabled={false}
        onClick={() => toggleSelectAll(selectedDate)}
        showDot={false}
      >
        {isAllSelected(selectedDate) ? t(KEY.common_unselect_all) : t(KEY.common_select_all)}
      </TimeslotButton>
    </div>
  );
}
