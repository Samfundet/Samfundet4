import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { TimeDuration } from '../TimeDuration';
import styles from './OpeningHours.module.scss';

type FakeVenue = {
  name: string;
  url: string;
  start: string;
  end: string;
};

type OpeningHoursProps = {
  venues: FakeVenue[];
};

export function OpeningHours({ venues }: OpeningHoursProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h2>{t(KEY.common_opening_hours)}</h2>
      <table className={styles.timeTable}>
        {venues.map((element, key) => (
          <tr key={key} className={styles.openingRow}>
            <td>
              <a href={element.url}>
                <p className={styles.openingHoursText}>{element.name}</p>
              </a>
            </td>
            <td className={styles.startEnd}>
              <TimeDuration className={styles.openingHoursText} start={element.start} end={element.end} />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
