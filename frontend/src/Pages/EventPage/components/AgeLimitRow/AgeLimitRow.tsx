import { useTranslation } from 'react-i18next';
import { EventDto } from '~/dto';
import { KEY, KeyValues } from '~/i18n/constants';
import { EventAgeRestriction, EventAgeRestrictionValue } from '~/types';
import styles from './AgeLimitRow.module.scss';

type EventTableProps = {
  event: EventDto;
};

export function AgeLimitRow({ event }: EventTableProps) {
  const { t } = useTranslation();
  const ageRestrictions: Record<EventAgeRestrictionValue, KeyValues> = {
    [EventAgeRestriction.NONE]: KEY.none,
    [EventAgeRestriction.EIGHTEEN]: KEY.eighteen,
    [EventAgeRestriction.TWENTY]: KEY.twenty,
    [EventAgeRestriction.MIXED]: KEY.mix,
  };

  const ageRestrictionKey = ageRestrictions[event.age_restriction];

  return (
    <tr>
      <td className={styles.table_element_left}>{t(KEY.common_age_limit).toUpperCase()}</td>
      <td className={styles.table_element_right}>{t(ageRestrictionKey)}</td>
    </tr>
  );
}
