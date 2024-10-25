import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputField } from '~/Components';
import { getEventGroups, getVenues } from '~/api';
import type { EventDto, EventGroupDto, VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import type { SetState } from '~/types';
import { lowerCapitalize } from '~/utils';
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
  const [selectedVenue, setSelectedVenue] = useState<VenueDto | null>();
  const [selectedEventGroup, setSelectedEventGroup] = useState<EventGroupDto | null>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getVenues()
      .then((data) => setVenues(data))
      .catch(console.error);
    getEventGroups() // TODO event groups are not categories. We don't have a datamodel for this yet
      .then((data) => setEventGroups(data))
      .catch(console.error);
  }, [allEvents]);

  const venueOptions: DropDownOption<number | null>[] = venues.map((venue) => {
    return { label: venue.name ?? '', value: venue.id } as DropDownOption<number>;
  });

  const eventGroupOptions: DropDownOption<number | null>[] = eventGroups.map((group) => {
    return { label: group.name ?? '', value: group.id };
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setEvents(eventQuery(allEvents, search, selectedVenue));
  }, [search, selectedVenue, selectedEventGroup]);

  return (
    <div className={styles.queryBar}>
      <InputField
        onChange={setSearch}
        placeholder={t(KEY.common_search)}
        labelClassName={styles.searchBar}
        icon="ic:baseline-search"
      />
      <Dropdown
        options={venueOptions}
        onChange={(val) => setSelectedVenue(venues.find((v) => v.id === val))}
        className={styles.element}
        nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.common_venue)}`) }}
      />

      <Dropdown
        options={eventGroupOptions}
        onChange={(val) => setSelectedEventGroup(eventGroups.find((eg) => eg.id === val))}
        className={styles.element}
        nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.event_type)}`) }}
      />
    </div>
  );
}
