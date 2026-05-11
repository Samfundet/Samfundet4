import { useTranslation } from 'react-i18next';
import { InputField } from '~/Components';
import { KEY } from '~/i18n/constants';
import type { EventCategoryValue, EventTicketTypeValue, SetState } from '~/types';
import { getEventCategoryKey, getTicketTypeKey, lowerCapitalize } from '~/utils';
import { Dropdown } from '../Dropdown';
import type { DropdownOption } from '../Dropdown/Dropdown';
import styles from './EventQuery.module.scss';

type EventQueryProps = {
  venues: string[] | null;
  categories: EventCategoryValue[] | null;
  ticketTypes?: string[] | null;
  selectedVenue: string | null;
  setSelectedVenue: SetState<string | null>;
  selectedCategory: EventCategoryValue | null;
  setSelectedCategory: SetState<EventCategoryValue | null>;
  selectedTicketType?: string | null;
  setSelectedTicketType?: SetState<string | null>;
  search: string;
  setSearch: SetState<string>;
};

export function EventQuery({
  venues,
  categories,
  ticketTypes,
  setSelectedVenue,
  setSelectedCategory,
  setSelectedTicketType,
  search,
  setSearch,
}: EventQueryProps) {
  const { t } = useTranslation();

  const venueOptions: DropdownOption<string | null>[] = (venues ?? []).map((venue) => {
    return { label: venue ?? '', value: venue } as DropdownOption<string | null>;
  });

  const categoryOptions: DropdownOption<string | null>[] = (categories ?? []).map((category) => {
    return { label: t(getEventCategoryKey(category)), value: category } as DropdownOption<string>;
  });

  const ticketTypeOptions: DropdownOption<string | null>[] = (ticketTypes ?? []).map((tt) => {
    return { label: t(getTicketTypeKey(tt as EventTicketTypeValue)), value: tt } as DropdownOption<string | null>;
  });

  return (
    <div className={styles.queryBar}>
      <InputField
        onChange={setSearch}
        placeholder={t(KEY.common_search)}
        labelClassName={styles.searchBar}
        icon="ic:baseline-search"
      />
      <Dropdown
        sortAlphabetic={true}
        options={venueOptions}
        onChange={(val) => setSelectedVenue(val as string)}
        className={styles.element}
        nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.common_venue)}`) }}
      />

      <Dropdown
        sortAlphabetic={true}
        options={categoryOptions}
        onChange={(val) => setSelectedCategory(val as EventCategoryValue)}
        className={styles.element}
        nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.category)}`) }}
      />

      {ticketTypes !== undefined && setSelectedTicketType && (
        <Dropdown
          options={ticketTypeOptions}
          onChange={(val) => setSelectedTicketType(val as string)}
          className={styles.element}
          nullOption={{ label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.common_ticket)}`) }}
        />
      )}
    </div>
  );
}
