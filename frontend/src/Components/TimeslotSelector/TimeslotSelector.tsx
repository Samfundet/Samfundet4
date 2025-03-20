import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TimeslotButton, ToolTip } from '~/Components';
import { getInterviewerAvailabilityOnDate, getRecruitmentAvailability } from '~/api';
import type { RecruitmentApplicationDto } from '~/dto';
import { useMouseDown } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { formatDateYMD, lowerCapitalize } from '~/utils';
import styles from './TimeslotSelector.module.scss';

type Props = {
  selectedDate: Date | null;
  timeslots: string[];
  onChange?: (timeslots: Record<string, string[]>) => void;

  selectedTimeslots?: Record<string, string[]>; // Selected timeslots
  disabledTimeslots?: Record<string, string[]>; // Timeslots which can't be selected

  selectMultiple?: boolean;
  readOnly?: boolean;
  label?: string;
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

export function TimeslotSelector({
  selectedDate,
  timeslots,
  onChange,
  selectMultiple,
  disabledTimeslots,
  readOnly,
  label,
  recruitmentId,
  application,
  ...props
}: Props) {
  const { t } = useTranslation();

  const [selectedTimeslots, setSelectedTimeslots] = useState<Record<string, string[]>>(props.selectedTimeslots || {});

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

  const { data: recruitmentTimeslots } = useQuery({
    queryKey: ['recruitmentTimeslots', recruitmentId],
    queryFn: async () => {
      if (!recruitmentId) {
        return null;
      }
      const response = await getRecruitmentAvailability(recruitmentId);
      return response.data;
    },
    enabled: !!recruitmentId,
  });

  const timeslotInterval = recruitmentTimeslots?.interval || 30;

  // Map of available interviewers for each timeslot
  const timeslotAvailabilityMap = useMemo(() => {
    if (!timeslots || !interviewers_objects || !selectedDate || !occupiedTimeslots) {
      return new Map();
    }

    const availabilityMap = new Map();

    // For each timeslot, determine which interviewers are available
    for (const timeslot of timeslots) {
      const timeslotMinutes = parseTimeToMinutes(timeslot);
      const timeslotEndMinutes = timeslotMinutes + timeslotInterval;

      // Find available interviewers for this timeslot by filtering out occupied interviewers
      const availableInterviewers = interviewers_objects.filter((interviewer) => {
        const isOccupied = occupiedTimeslots.some((slot) => {
          if (slot.user !== interviewer.id) {
            return false;
          }
          const occupiedTimeMinutes = parseTimeToMinutes(slot.time);
          const occupiedEndMinutes = occupiedTimeMinutes + timeslotInterval;

          // Check for overlap
          return doTimeRangesOverlap(timeslotMinutes, timeslotEndMinutes, occupiedTimeMinutes, occupiedEndMinutes);
        });

        // Interviewer is available if not occupied
        return !isOccupied;
      });

      availabilityMap.set(timeslot, availableInterviewers);
    }

    return availabilityMap;
  }, [timeslots, interviewers_objects, selectedDate, occupiedTimeslots, timeslotInterval]);

  // Format available interviewers for display in tooltip
  const getAvailableInterviewersForTimeslot = useCallback(
    (timeslot: string) => {
      if (!selectedDate) return 'Select a date first';
      if (isLoading) return 'Loading...';

      const availableInterviewers = timeslotAvailabilityMap.get(timeslot);
      if (!availableInterviewers) return 'No data available';

      return availableInterviewers.length > 0
        ? `${`${t(KEY.common_available)}: `}${availableInterviewers
            .map((i: { first_name: string; last_name: string }) => `${i.first_name} ${i.last_name}`)
            .join(', ')}`
        : t(KEY.recruitment_no_interviewers_available);
    },
    [selectedDate, isLoading, timeslotAvailabilityMap, t],
  );

  // Click & drag functionality
  const mouseDown = useMouseDown();
  // dragSetSelected decides whether we select or unselect buttons we drag over
  const [dragSetSelected, setDragSetSelected] = useState(false);

  useEffect(() => {
    onChange?.(selectedTimeslots);
  }, [onChange, selectedTimeslots]);

  function toggleTimeslot(date: Date, timeslot: string) {
    if (disabledTimeslots?.[formatDateYMD(date)]?.includes(timeslot)) {
      return;
    }
    if (!selectMultiple) {
      const selected = isTimeslotSelected(date, timeslot);
      setSelectedTimeslots(selected ? {} : { [formatDateYMD(date)]: [timeslot] });
      return;
    }
    const dayString = formatDateYMD(date);
    const copy = { ...selectedTimeslots };
    if (selectedTimeslots[dayString]) {
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
    setSelectedTimeslots(copy);
  }

  function selectTimeslot(date: Date, timeslot: string) {
    if (isTimeslotSelected(date, timeslot)) {
      return;
    }
    const dayString = formatDateYMD(date);
    const copy = { ...selectedTimeslots };
    if (copy[dayString]) {
      copy[dayString].push(timeslot);
    } else {
      copy[dayString] = [timeslot];
    }
    setSelectedTimeslots(copy);
  }

  function unselectTimeslot(date: Date, timeslot: string) {
    if (!isTimeslotSelected(date, timeslot)) {
      return;
    }
    const dayString = formatDateYMD(date);
    const copy = { ...selectedTimeslots };
    copy[dayString] = copy[dayString].filter((s) => s !== timeslot);
    if (copy[dayString].length === 0) {
      delete copy[dayString];
    }
    setSelectedTimeslots(copy);
  }

  function isTimeslotIn(list: Record<string, string[]> | undefined, date: Date, timeslot: string): boolean {
    return list?.[formatDateYMD(date)]?.includes(timeslot) || false;
  }

  function isTimeslotSelected(date: Date, timeslot: string) {
    return isTimeslotIn(selectedTimeslots, date, timeslot);
  }

  function isTimeslotDisabled(date: Date, timeslot: string) {
    return isTimeslotIn(disabledTimeslots, date, timeslot);
  }

  function isAllSelected(date: Date) {
    const selectedLength = selectedTimeslots[formatDateYMD(date)]?.length || 0;
    return selectedLength === timeslots.length;
  }

  function toggleSelectAll(date: Date) {
    const slots = { ...selectedTimeslots };
    if (isAllSelected(date)) {
      delete slots[formatDateYMD(date)];
    } else {
      slots[formatDateYMD(date)] = timeslots;
    }
    setSelectedTimeslots(slots);
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
      {label}
      <div className={styles.timeslots}>
        {timeslots.map((timeslot) => {
          const selected = isTimeslotSelected(selectedDate, timeslot);
          const disabled = isTimeslotDisabled(selectedDate, timeslot);
          const availableInterviewersForTimeslot = getAvailableInterviewersForTimeslot(timeslot);

          const button = (
            <TimeslotButton
              key={timeslot}
              active={selected}
              disabled={disabled}
              readOnly={readOnly}
              onMouseDown={(event) => {
                if (event.button !== 0 || readOnly) {
                  // Ignore if not primary mouse button
                  return;
                }
                toggleTimeslot(selectedDate, timeslot);
                setDragSetSelected(!selected);
              }}
              onMouseEnter={() => onMouseEnter(selectedDate, timeslot)}
              onKeyDown={(event) => {
                if (readOnly || (event.key !== ' ' && event.key !== 'Enter')) return;
                toggleTimeslot(selectedDate, timeslot);
              }}
              aria-pressed={selected}
            >
              {timeslot}
            </TimeslotButton>
          );

          return disabledTimeslots ? (
            <ToolTip key={timeslot} value={availableInterviewersForTimeslot}>
              {button}
            </ToolTip>
          ) : (
            button
          );
        })}
      </div>
      {selectMultiple && !readOnly && (
        <TimeslotButton active={isAllSelected(selectedDate)} onClick={() => toggleSelectAll(selectedDate)}>
          {isAllSelected(selectedDate) ? t(KEY.common_unselect_all) : t(KEY.common_select_all)}
        </TimeslotButton>
      )}
    </div>
  );
}
