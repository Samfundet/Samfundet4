import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMouseDown } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { formatDateYMD, lowerCapitalize } from '~/utils';
import styles from './TimeslotContainer.module.scss';
import { TimeslotButton } from './components/TimeslotButton';
import { RecruitmentApplicationDto } from '~/dto';
import { getInterviewerAvailabilityOnDate } from '~/api';
import { useQuery } from '@tanstack/react-query';
import { ToolTip } from '../ToolTip';

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

  //FOR 1679 ISSUE
  const formattedDate = useMemo(() => (selectedDate ? formatDateYMD(selectedDate) : ''), [selectedDate]);

  const interviewers_objects = application?.recruitment_position.interviewers;
  const interviewers = application?.recruitment_position.interviewers?.map((interviewer) => interviewer.id); //henter intervjuer IDer

  // console.log('Interviewers:', interviewers_objects);

  // Fetch occupied timeslots
  const { data, isLoading, isError } = useQuery({
    queryKey: ['interviewerAvailability', recruitmentId, formattedDate, interviewers],
    queryFn: async () => {
      const response = await getInterviewerAvailabilityOnDate(recruitmentId || 0, formattedDate, interviewers || []);
      return response.data;
    },
    enabled: !!(selectedDate && recruitmentId && (interviewers?.length ?? 0) > 0),
  });

  console.log('data', data);

  // Helper function to check if a timeslot overlaps with an occupied period

  //working for all exept 23:00 and 23:30
  const isTimeSlotOccupied = (timeslot: string, occupiedSlot: any) => {
    // Convert timeslot string to Date objects for the selected date
    const [hours, minutes] = timeslot.split(':').map(Number);
    const slotStart = new Date(selectedDate!);
    slotStart.setHours(hours + 1, minutes, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30); // Assuming 30-minute slots

    const occupiedStart = new Date(occupiedSlot.start_dt);
    const occupiedEnd = new Date(occupiedSlot.end_dt);

    console.log();

    return (
      (slotStart >= occupiedStart && slotStart < occupiedEnd) || (slotEnd > occupiedStart && slotEnd <= occupiedEnd)
    );
  };

  //MUST LOOK MORE AT THIS NEXT TIME! IF 23:00 AND 23:30 IS SET AS OCCUPIED TIMESLOTS, IT WILL NOT WORK
  //Forsøk 1
  // const isTimeSlotOccupied = (timeslot: string, occupiedSlot: any) => {
  //   // Convert timeslot string to Date objects for the selected date
  //   const [hours, minutes] = timeslot.split(':').map(Number);
  //   const slotStart = new Date(selectedDate!);
  //   slotStart.setHours(hours, minutes, 0, 0);
  //   const slotEnd = new Date(slotStart);
  //   slotEnd.setMinutes(slotEnd.getMinutes() + 30);

  //   // Parse the ISO strings while preserving the timezone offset
  //   const occupiedStartLocal = new Date(occupiedSlot.start_dt.replace('+01:00', ''));
  //   const occupiedEndLocal = new Date(occupiedSlot.end_dt.replace('+01:00', ''));

  //   console.log('Timeslot:', timeslot);
  //   console.log('SlotStart:', slotStart.toISOString());
  //   console.log('SlotEnd:', slotEnd.toISOString());
  //   console.log('OccupiedStart:', occupiedStartLocal.toISOString());
  //   console.log('OccupiedEnd:', occupiedEndLocal.toISOString());

  //   const isOccupied =
  //     (slotStart >= occupiedStartLocal && slotStart < occupiedEndLocal) ||
  //     (slotEnd > occupiedStartLocal && slotEnd <= occupiedEndLocal);

  //   console.log('Is Occupied:', isOccupied);
  //   console.log('-------------------');

  //   return isOccupied;
  // };

  //Forsøk 2
  // const isTimeSlotOccupied = (timeslot: string, occupiedSlot: any) => {
  //   // Convert timeslot string to Date objects for the selected date
  //   const [hours, minutes] = timeslot.split(':').map(Number);
  //   const slotStart = new Date(selectedDate!);
  //   // Convert the local time to UTC+1 by adding 1 hour
  //   slotStart.setHours(hours + 1, minutes, 0, 0);
  //   const slotEnd = new Date(slotStart);
  //   slotEnd.setMinutes(slotEnd.getMinutes() + 30);

  //   // Parse the occupied slot times as they are (they're already in UTC+1)
  //   const occupiedStart = new Date(occupiedSlot.start_dt);
  //   const occupiedEnd = new Date(occupiedSlot.end_dt);

  //   console.log('Timeslot:', timeslot);
  //   console.log('SlotStart:', slotStart.toISOString());
  //   console.log('SlotEnd:', slotEnd.toISOString());
  //   console.log('OccupiedStart:', occupiedStart.toISOString());
  //   console.log('OccupiedEnd:', occupiedEnd.toISOString());

  //   const isOccupied =
  //     (slotStart >= occupiedStart && slotStart < occupiedEnd) || (slotEnd > occupiedStart && slotEnd <= occupiedEnd);

  //   console.log('Is Occupied:', isOccupied);
  //   console.log('-------------------');

  //   return isOccupied;
  // };

  // Get available interviewers for a specific timeslot
  const getAvailableInterviewersForTimeslot = (timeslot: string) => {
    if (!data || !interviewers_objects) return 'No interviewers available';

    const availableInterviewers = interviewers_objects.filter((interviewer) => {
      // Check if the interviewer has any conflicts for this specific timeslot
      const hasConflict = data.some(
        (occupiedSlot) => occupiedSlot.user === interviewer.id && isTimeSlotOccupied(timeslot, occupiedSlot),
      );
      return !hasConflict;
    });

    return availableInterviewers.length > 0
      ? availableInterviewers.map((i) => `${i.first_name} ${i.last_name}`).join(', ')
      : 'No interviewers available';
  };

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

  const occupiedInterviewerIds = data?.map((timeslot) => timeslot.user);
  const availableInterviewers = application?.recruitment_position.interviewers?.filter(
    (interviewer) => !(occupiedInterviewerIds ?? []).includes(interviewer.id),
  );

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
