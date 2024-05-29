import { useTranslation } from 'react-i18next';
import { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './AgeLimitRow.module.scss';
import { getEventAgeRestrictionKey } from './utils';

type AgeLimitRowProps = {
  event: EventDto;
};

export function AgeLimitRow({ event }: AgeLimitRowProps) {
  const { t } = useTranslation();

  const ageRestrictionKey = getEventAgeRestrictionKey(event.age_restriction);

  return (
    <tr>
      <td className={styles.table_element_left}>{t(KEY.common_age_limit).toUpperCase()}</td>
      <td className={styles.table_element_right}>{t(ageRestrictionKey)}</td>
    </tr>
  );
}
