import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInterviewerAvailabilityOnDate } from '~/api';
import type { RecruitmentApplicationDto } from '~/dto';
import { useMouseDown } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { formatDateYMD, lowerCapitalize } from '~/utils';
import { ToolTip } from '../ToolTip';
import styles from './TimeslotContainer.module.scss';
import { TimeslotButton } from './components/TimeslotButton';

type TimeslotContainerProps = {
  selectedDate: Date | null;
  timeslots: string[];
  onChange?: (timeslots: Record<string, string[]>) => void;
  activeTimeslots?: Record<string, string[]>; //De røde timeslotsene ( "occupied" )
  selectedTimeslot?: Record<string, string[]>; //Den ene grønne timesloten ( "selected" )
  disabledTimeslots?: Record<string, string[]>; //De grå timeslotsene ( "disabled" )
  selectMultiple: boolean;
  hasDisabledTimeslots: boolean;
  recruitmentId?: number;
  application?: RecruitmentApplicationDto;
};

// Helper function to parse HH:MM string to minutes since midnight
const parseTimeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to check if two time ranges overlap
const doTimeRangesOverlap = (startTime1: number, endTime1: number, startTime2: number, endTime2: number): boolean => {
  return startTime1 < endTime2 && endTime1 > startTime2;
};

export function TimeslotContainer({
  selectedDate,
  timeslots,
  onChange,
  selectMultiple,
  hasDisabledTimeslots,
  recruitmentId,
  application,
  ...props
}: TimeslotContainerProps) {
  const { t } = useTranslation();

  const [activeTimeslots, setActiveTimeslots] = useState<Record<string, string[]>>(props.activeTimeslots || {});
  const [selectedTimeslot, setSelectedTimeslot] = useState<Record<string, string[]>>(props.selectedTimeslot || {});
  const disabledTimeslots = props.disabledTimeslots || {};

  const formattedDate = useMemo(() => (selectedDate ? formatDateYMD(selectedDate) : ''), [selectedDate]);

  // Get interviewers from application data
  const interviewers_objects = application?.recruitment_position.interviewers || [];
  const interviewers = interviewers_objects.map((interviewer) => interviewer.id);

  // Fetch occupied timeslots for interviewers on the selected date
  const { data: occupiedTimeslots, isLoading } = useQuery({
    queryKey: ['interviewerAvailability', recruitmentId, formattedDate, interviewers],
    queryFn: async () => {
      if (!recruitmentId || !formattedDate || !interviewers.length) {
        return [];
      }
      const response = await getInterviewerAvailabilityOnDate(recruitmentId, formattedDate, interviewers);
      return response.data;
    },
    enabled: !!(selectedDate && recruitmentId && interviewers.length > 0),
  });

  // Map of available interviewers for each timeslot
  const timeslotAvailabilityMap = useMemo(() => {
    if (!timeslots || !interviewers_objects || !selectedDate || !occupiedTimeslots) {
      return new Map();
    }

    const availabilityMap = new Map();

    // For each timeslot, determine which interviewers are available
    for (const timeslot of timeslots) {
      const timeslotMinutes = parseTimeToMinutes(timeslot);
      const timeslotEndMinutes = timeslotMinutes + 30; // Antar 30 min slots, kan og bør kanskje endres? om annet er mulig?

      // Find available interviewers for this timeslot by filtering out occupied interviewers
      const availableInterviewers = interviewers_objects.filter((interviewer) => {
        const isOccupied = occupiedTimeslots.some((slot) => {
          if (slot.user !== interviewer.id) {
            return false;
          }
          const occupiedTimeMinutes = parseTimeToMinutes(slot.time);
          const occupiedEndMinutes = occupiedTimeMinutes + 30; // Antar 30 min slots på occupiedslots også

          // Check for overlap
          return doTimeRangesOverlap(timeslotMinutes, timeslotEndMinutes, occupiedTimeMinutes, occupiedEndMinutes);
        });

        // Interviewer is available if not occupied
        return !isOccupied;
      });

      availabilityMap.set(timeslot, availableInterviewers);
    }

    return availabilityMap;
  }, [timeslots, interviewers_objects, selectedDate, occupiedTimeslots]);

  // Format available interviewers for display in tooltip
  const getAvailableInterviewersForTimeslot = useCallback(
    (timeslot: string) => {
      if (!selectedDate) return 'Select a date first';
      if (isLoading) return 'Loading...';

      const availableInterviewers = timeslotAvailabilityMap.get(timeslot);
      if (!availableInterviewers) return 'No data available';

      return availableInterviewers.length > 0
        ? `Available: ${availableInterviewers
            .map((i: { first_name: string; last_name: string }) => `${i.first_name} ${i.last_name}`)
            .join(', ')}`
        : 'No interviewers available';
    },
    [selectedDate, isLoading, timeslotAvailabilityMap],
  );

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
      {selectMultiple ? `${t(KEY.occupied_select_time_text)}:` : `${t(KEY.recruitment_choose_interview_time)}:`}
      {/* ^not a great solution, but works for the current purposes of this TimeslotContainer*/}
      <div className={styles.timeslots}>
        {timeslots.map((timeslot) => {
          const active = isTimeslotSelected(selectedDate, timeslot);
          const disabled = isTimeslotDisabled(selectedDate, timeslot);
          const onlyOneChosen = isOnlyTimeSlot(selectedDate, timeslot);
          const availableInterviewersForTimeslot = getAvailableInterviewersForTimeslot(timeslot);

          const timeslotButton = (
            <TimeslotButton
              key={timeslot}
              active={active}
              disabled={disabled || false}
              onMouseDown={(event) => {
                if (event.button !== 0) {
                  return;
                }
                toggleTimeslot(selectedDate, timeslot);
                setDragSetSelected(!active);
              }}
              onMouseEnter={() => onMouseEnter(selectedDate, timeslot)}
              onlyOneValid={onlyOneChosen}
            >
              {timeslot}
            </TimeslotButton>
          );

          return hasDisabledTimeslots ? (
            <ToolTip key={timeslot} value={availableInterviewersForTimeslot}>
              {timeslotButton}
            </ToolTip>
          ) : (
            timeslotButton
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
