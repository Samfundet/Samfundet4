import { useEffect, useState } from 'react';
import { EventsList } from './components/EventsList';
import { getEventsFilter, getEventsPerDay, getVenues } from '~/api';
import { Page } from '~/Components/Page';
import { Button, InputField, RadioButton, SamfundetLogoSpinner } from '~/Components';
import styles from './EventsPage.module.scss';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '~/Components/Checkbox';
import { VenueDto } from '~/dto';

export function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState({});
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [venues, setVenues] = useState<VenueDto[]>([]);
  const [selectedVenue, setSelectedVenue] = useState('all');
  const [filterToggle, setFilterToggle] = useState(true);
  const [archived, setArchived] = useState(false);

  const handleArchived = () => {
    setArchived(!archived);
  };

  const handleClick = () => {
    let venue_value;
    if (selectedVenue == 'all') {
      venue_value = '';
    } else {
      venue_value = selectedVenue;
    }
    getEventsFilter({ search: search, location: venue_value, archived: String(archived) }).then((data) => {
      setEvents(data);
    });
  };

  useEffect(() => {
    getEventsPerDay().then((data) => {
      setEvents(data);
      setShowSpinner(false);
    });

    getVenues().then((data) => {
      setVenues(data);
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

  return (
    <Page>
      <Button onClick={handleFilterToggle} className={styles.buttonClass}>
        Filter
      </Button>

      {filterToggle ? (
        <div>
          <div>
            <div className={styles.center}>
              <InputField
                type="text"
                key={'search'}
                onChange={(e) => {
                  setSearch(e ? e.currentTarget.value : '');
                }}
                value={search}
                placeholder={t(KEY.search_all)}
              />
            </div>

            <label className={styles.center}>{t(KEY.select_event)}</label>

            <div className={styles.filterColumn}>
              <label className={styles.container} key={t(KEY.all_venues)}>
                <RadioButton
                  name="venues"
                  value=""
                  checked={selectedVenue.includes('all')}
                  onChange={() => setSelectedVenue('all')}
                />
                {t(KEY.all_venues)}
              </label>

              {venues.map((venue) => (
                <label className={styles.container} key={venue.name}>
                  <RadioButton
                    name="venues"
                    value={venue.name}
                    checked={selectedVenue.includes(venue.name as string)}
                    onChange={() => setSelectedVenue(venue.name as string)}
                  />
                  {venue.name}
                </label>
              ))}
            </div>
            <label className={styles.center}>
              <Checkbox onClick={handleArchived} />
              {t(KEY.archived_events)}
            </label>
          </div>

          <div className={styles.center}>
            <Button className={styles.buttonClass} onClick={handleClick}>
              Søk
            </Button>
          </div>
        </div>
      ) : null}
      <EventsList events={events} />
    </Page>
  );
}
