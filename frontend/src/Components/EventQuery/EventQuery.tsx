import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputField } from '~/Components';
import { KEY } from '~/i18n/constants';
import type { EventCategoryValue, SetState } from '~/types';
import { lowerCapitalize } from '~/utils';
import { Dropdown } from '../Dropdown';
import type { DropdownOption } from '../Dropdown/Dropdown';
import styles from './EventQuery.module.scss';

type EventQueryProps = {
  venues: string[] | null;
  categories: EventCategoryValue[] | null;
  selectedVenue: string | null;
  setSelectedVenue: SetState<string | null>;
  selectedCategory: EventCategoryValue | null;
  setSelectedCategory: SetState<EventCategoryValue | null>;
};

export function EventQuery({ venues, categories, setSelectedVenue, setSelectedCategory }: EventQueryProps) {
  const { t } = useTranslation();

  // Search
  const [search, setSearch] = useState<string>('');

  const venueOptions: DropdownOption<string | null>[] = (venues ?? []).map((venue) => {
    return { label: venue ?? '', value: venue } as DropdownOption<string | null>;
  });

  const categoryOptions: DropdownOption<string | null>[] = (categories ?? []).map((category) => {
    return { label: category, value: category } as DropdownOption<string>;
  });

  // // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // useEffect(() => {
  //   setEvents(eventQuery(allEvents, search, selectedVenue));
  // }, [search, selectedVenue, selectedCategory]);

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
        onChange={(val) => setSelectedVenue(val as string)}
        className={styles.element}
        nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.common_venue)}`) }}
      />

      <Dropdown
        options={categoryOptions}
        onChange={(val) => setSelectedCategory(val as EventCategoryValue)}
        className={styles.element}
        nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.event_type)}`) }}
      />
    </div>
  );
}
