import {useEffect, useState} from 'react';
import {EventsList} from './components/EventsList';
import {getEventsFilter, getEventsPerDay, getVenues} from '~/api';
import {Page} from '~/Components/Page';
import {Button, InputField, RadioButton, SamfundetLogoSpinner} from '~/Components';
import styles from './EventsPage.module.scss';
import {KEY} from '~/i18n/constants';
import {useTranslation} from "react-i18next";
import {Checkbox} from "~/Components/Checkbox";


interface Venue {
  id: number;
  name: string;
  description: string;
}


export function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState({});
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [filterToggle, setFilterToggle] = useState(true);
  const [archived, setArchived] = useState(false);


  const handleArchived = () => {
      setArchived(!archived)
  }


  const handleClick = () => {
    let venue_value;
    if (selectedVenue == 'all') {
      venue_value = '';

    } else {
      venue_value = selectedVenue;
    }

    const fields =
      '?title=' + title +
      '&search=' + search +
      '&location=' + venue_value +
      '&archived=' + archived

    getEventsFilter(fields).then((data) => {
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
        <SamfundetLogoSpinner/>
      </div>
    );
  }

  return (
    <Page>

        <Button
          onClick={handleFilterToggle}
          className={styles.buttonClass} >
          Filter
        </Button>

        { filterToggle ?

        <div>
        <div>
          <div className={styles.center}>

          <InputField
                type='text'
                key={'search'}
                onChange={(e) => {
                  setSearch(e ? e.currentTarget.value : '')
                }}
                value={search}
                placeholder={t(KEY.search_all)}
              /></div>

          <label className={styles.center}>{t(KEY.select_event)}</label>

          <div className={styles.filterColumn}>
                <label className={styles.container} key={t(KEY.all_venues)}>

                <RadioButton name='venues'
                   value=''
                   checked={selectedVenue.includes('all')}
                   onChange={(event) => {
                     if (event.target.checked) {
                       setSelectedVenue('all');
                     }
                   }}

                />
                  {t(KEY.all_venues)}
                </label>

          {venues.map((venue) => (
          <label className={styles.container} key={venue.name}>

            <RadioButton name='venues'
                   value={venue.name}
                   checked={selectedVenue.includes(venue.name)}
                   onChange={(event) => {
                     if (event.target.checked) {
                       setSelectedVenue(venue.name);
                     }
                   }}
            />
            {venue.name}
          </label>
          ))}
          </div>
          <label className={styles.center}>
          <Checkbox onClick={handleArchived} />
            Se arkiverte hendelser
        </label>
        </div>

        <div className={styles.center}>
          <Button className={styles.buttonClass} onClick={handleClick}>Søk</Button>
        </div>


      </div>
           : null}
      <EventsList events={events}/>

    </Page>
  );
}
