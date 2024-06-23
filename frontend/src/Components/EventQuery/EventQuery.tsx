import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputField } from '~/Components';
import { getEventGroups, getVenues } from '~/api';
import type { EventDto, EventGroupDto, VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import type { SetState } from '~/types';
import { Dropdown } from '../Dropdown';
import type { DropDownOption } from '../Dropdown/Dropdown';
import styles from './EventQuery.module.scss';
import { eventQuery } from './utils';

type EventQueryProps = {
  allEvents: EventDto[];
  setEvents: SetState<EventDto[]>;
};

export function EventQuery({ allEvents, setEvents }: EventQueryProps) {
  const { t } = useTranslation();

  // Data
  const [venues, setVenues] = useState<VenueDto[]>([]);
  const [eventGroups, setEventGroups] = useState<EventGroupDto[]>([]);

  // Search
  const [search, setSearch] = useState<string>('');
  const [selectedVenue, setSelectedVenue] = useState<VenueDto>();
  const [selectedEventGroup, setSelectedEventGroup] = useState<EventGroupDto>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getVenues()
      .then((data) => setVenues(data))
      .catch(console.error);
    getEventGroups() // TODO event groups are not categories. We don't have a datamodel for this yet
      .then((data) => setEventGroups(data))
      .catch(console.error);
  }, [allEvents]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setEvents(eventQuery(allEvents, search, selectedVenue));
  }, [search, selectedVenue, selectedEventGroup]);

  const venueOptions: DropDownOption<VenueDto>[] = venues.map((venue) => {
    return { label: venue.name ?? '', value: venue };
  });

  const eventGroupOptions: DropDownOption<EventGroupDto>[] = eventGroups.map((group) => {
    return { label: group.name ?? '', value: group };
  });

  return (
    <div className={styles.queryBar}>
      <InputField
        onChange={setSearch}
        placeholder={t(KEY.common_search)}
        labelClassName={styles.searchBar}
        icon="ic:baseline-search"
      />
      <Dropdown<VenueDto | undefined>
        options={venueOptions}
        onChange={(venue) => setSelectedVenue(venue)}
        className={styles.element}
        defaultValue={{ label: `${t(KEY.common_choose)} ${t(KEY.common_venue)}`, value: undefined }}
      />
      <Dropdown<EventGroupDto | undefined>
        options={eventGroupOptions}
        onChange={(group) => setSelectedEventGroup(group)}
        className={styles.element}
        defaultValue={{ label: `${t(KEY.common_choose)} ${t(KEY.event_type)}`, value: undefined }}
      />
    </div>
  );
}
