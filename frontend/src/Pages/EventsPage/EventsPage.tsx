import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { getEventsPerDay } from '~/api';
import { KEY } from '~/i18n/constants';
import { EventsList } from './components/EventsList';
import styles from './EventsPage.module.scss';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { EventOptionsDto, VenueDto } from '~/dto';
import { Params } from '~/named-urls';
import { FilterRow } from '~/Pages/EventsPage/components/FilterRow';
import { toast } from 'react-toastify';

const urlArgs: Params = {};

export function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState({});
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [venues, setVenues] = useState<VenueDto[]>([]);
  const [filterToggle, setFilterToggle] = useState<boolean>(false);
  const [eventsOptions, setEventsOption] = useState<EventOptionsDto | null>(null);
  
  const handleClick = () => {
    if (search == '') {
      delete urlArgs['search'];
    } else {
      urlArgs['search'] = search;
    }

    getEventsFilter(urlArgs).then((data) => {
      setEvents(data);
    });
  };

  useEffect(() => {
    getEventsPerDay().then((data) => {
      setEvents(data)
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps;
    });

    getVenues().then((data) => {
      setVenues(data);
    });

    optionsEvents().then((data) => {
      setEventsOption(data);
      setShowSpinner(false);
    });
  }, []);

  const handleFilterToggle = () => {
    setFilterToggle(!filterToggle);
  };

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return <EventsList events={events} />;
}
