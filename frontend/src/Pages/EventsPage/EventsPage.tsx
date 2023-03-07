import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import {EventsList} from './components/EventsList';
import {getEventsFilter, getEventsPerDay, getVenues} from '~/api';
import {Page} from '~/Components/Page';
import {InputField, RadioButton, SamfundetLogoSpinner} from '~/Components';
import styles from './EventsPage.module.scss';
import {Checkbox} from "~/Components/Checkbox";


interface Venue {
  id: number;
  name: string;
  description: string;
  // add other properties as needed
}


export function EventsPage() {
  const [events, setEvents] = useState({});
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [filterToggle, setFilterToggle] = useState(true);


  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleClick = () => {
    console.log(selectedVenue)
    const fields = "?title=" + title + "&search=" + search +"&location="+selectedVenue

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

        <button
          onClick={handleFilterToggle}
          className={styles.buttonClass} >
          Filter
        </button>

        { filterToggle ?
        <div>
        <div>
          <div className={styles.center}>

            <label key={search}>Søk over alt!
              <InputField
                type="text"
                onChange={handleSearch}
                value={search}
              /></label>
          </div>

          <div className={styles.filterColumn}>
            <label>Venues:</label>

              <label className={styles.container} key="All">
                <input type="checkbox" name="venues"
                   value="All"
                   checked={selectedVenue.includes("All")}
                   onChange={(event) => {
                     if (event.target.checked) {
                       setSelectedVenue('');
                     }
                   }}

                />
            <span className={styles.checkmark}></span>
            All
          </label>
          {venues.map((venue) => (
          <label className={styles.container} key={venue.name}>

            <RadioButton name="venues"
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
          <button className={styles.buttonClass} onClick={handleClick}>Søk</button>
        </div>


      </div>
           : null}

      <EventsList events={events}/>

    </Page>
  );
}
