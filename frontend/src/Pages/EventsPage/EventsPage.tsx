import { useEffect, useState } from 'react';
import { EventsList } from './components/EventsList';
import { getEventsFilter, getEventsPerDay, getVenues, optionsEvents } from '~/api';
import { Page } from '~/Components/Page';
import { Button, InputField, RadioButton, SamfundetLogoSpinner } from '~/Components';

import styles from './EventsPage.module.scss';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { EventOptionsDto, VenueDto } from '~/dto';
import { Params } from '~/named-urls';
import { FilterRow } from '~/Pages/EventsPage/components/FilterRow';

const urlArgs: Params = {};

export function EventsPage() {
  const { t } = useTranslation<string>();
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
      setEvents(data);
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

  const searchBar = (
    <div className={styles.center}>
      <InputField
        type="text"
        key={'search'}
        onChange={(e) => {
          setSearch(e?.currentTarget.value || '');
        }}
        value={search}
        placeholder={t(KEY.search_all)}
      />
    </div>
  );

  const selectVenues = (
    <div>
      <div className={styles.colour_label}>
        <label className={styles.center}>{t(KEY.select_event)}</label>
      </div>
      <div className={styles.filterColumn}>
        <label className={styles.container} key={t(KEY.all)}>
          <RadioButton name="venues" value={'all'} defaultChecked={true} onChange={() => delete urlArgs['location']} />
          {t(KEY.all)}
        </label>

        {venues.map((venue) => (
          <label className={styles.container} key={venue.name || ''}>
            <RadioButton name="venues" value={venue.name || ''} onChange={() => (urlArgs['location'] = venue.name)} />
            {venue.name || ''}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <Page>
      <Button onClick={handleFilterToggle}>Filter</Button>

      {filterToggle ? (
        <div>
          {searchBar}
          {selectVenues}

          {eventsOptions && (
            <>
              <FilterRow
                label={t(KEY.event_category)}
                name={'category'}
                property={eventsOptions.actions.POST.category.choices}
                urlArgs={urlArgs}
              />

              <FilterRow
                label={t(KEY.choose_age)}
                name={'age_group'}
                property={eventsOptions.actions.POST.age_group.choices}
                urlArgs={urlArgs}
              />
              <FilterRow
                label={t(KEY.choose_status)}
                name={'status_group'}
                property={eventsOptions.actions.POST.status_group.choices}
                urlArgs={urlArgs}
              />
            </>
          )}

          <div className={styles.center}>
            <Button className={styles.buttonClass} onClick={handleClick}>
              {t(KEY.common_search)}
            </Button>
          </div>
        </div>
      ) : null}
      <EventsList events={events} />
    </Page>
  );
}
