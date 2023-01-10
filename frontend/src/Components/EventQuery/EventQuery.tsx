import { useState, useEffect } from 'react';
import { Dropdown } from '../Dropdown';
import { InputField } from '../InputField';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import styles from './EventQuery.module.scss';
import { getEventGroups, getVenues } from '~/api';
import { EventDto } from '~/dto';
import { eventQuery } from './utils';

type EventQueryProps = {
  allEvents: EventDto[];
  setEvents: void;
};

export function EventQuery({ allEvents, setEvents }: EventQueryProps) {
  const { t } = useTranslation();
  const [venues, setVenues] = useState<string[]>([]);
  const [eventGroups, setEventGroups] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [selectedEventType, setSelectedEventType] = useState<string>('');

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    getVenues()
      .then((data) => {
        setVenues(
          data.map(function (element) {
            return [element.name];
          }),
        );
      })
      .catch(console.error);
    getEventGroups()
      .then((data) => {
        setEventGroups(
          data.map(function (element) {
            return [element.id, element.name];
          }),
        );
      })
      .catch(console.error);
  }, [allEvents]);

  useEffect(() => {
    setEvents(eventQuery(allEvents, search, selectedVenue, selectedEventType));
  }, [search, selectedVenue, selectedEventType]);

  return (
    <div className={styles.queryBar}>
      <InputField
        onChange={(e) => setSearch(e ? e.currentTarget.value : '')}
        placeholder={t(KEY.common_search)}
        className={styles.element}
      />
      <Dropdown
        options={venues}
        onChange={(e) => setSelectedVenue(e ? e.currentTarget.value : '')}
        wrapper={styles.element}
        default_value={t(KEY.common_choose) + ' ' + t(KEY.venue)}
      />
      <Dropdown
        options={eventGroups}
        onChange={(e) => setSelectedEventType(e ? e.currentTarget.value : '')}
        wrapper={styles.element}
        default_value={t(KEY.common_choose) + ' ' + t(KEY.event_type)}
      />
    </div>
  );
}
