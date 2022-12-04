import { TimeDuration } from '../TimeDuration';
import styles from './OpeningHours.module.scss';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';

type OpeningHoursProps = {
  venues: Array;
};

export function OpeningHours({ venues }: OpeningHoursProps) {æ
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
                  <p>{element.name}</p>
                </a>
              </td>
              <td className={styles.startEnd}>
                <TimeDuration start={element.start} end={element.end} />
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
