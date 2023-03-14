import { useTranslation } from 'react-i18next';
import { VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { TimeDuration } from '../TimeDuration';
import styles from './OpeningHours.module.scss';

type OpeningHoursProps = {
  venues: VenueDto[];
};

export function OpeningHours({ venues }: OpeningHoursProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h2>{t(KEY.opening_hours)}</h2>
      <table className={styles.timeTable}>
        {venues.map(function (element, key) {
          return (
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
          );
        })}
      </table>
    </div>
  );
}
