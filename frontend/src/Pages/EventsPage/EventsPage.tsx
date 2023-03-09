import {
  useEffect,
  useState }

  from 'react';
import {EventsList} from './components/EventsList';
import {getEventsFilter, getEventsPerDay, getVenues} from '~/api';
import {Page} from '~/Components/Page';
import {Button, InputField, RadioButton, SamfundetLogoSpinner} from '~/Components';
import styles from './EventsPage.module.scss';


interface Venue {
  id: number;
  name: string;
  description: string;
}


export function EventsPage() {
  const [events, setEvents] = useState({});
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [filterToggle, setFilterToggle] = useState(true);


  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleClick = () => {
    const fields = '?title=' + title + '&search=' + search +'&location='+selectedVenue

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
                  console.log(search);
                  setSearch(e ? e.currentTarget.value : '')
                }}
                value={search}
                placeholder={'Søk over alt!'}
              /></div>

          <label className={styles.center}>Venues</label>

          <div className={styles.filterColumn}>
                <label className={styles.container} key={'All'}>

                <RadioButton name='venues'
                   value='All'
                   checked={selectedVenue.includes('All')}
                   onChange={(event) => {
                     if (event.target.checked) {
                       setSelectedVenue('');
                     }
                   }}

                />
                  All
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
