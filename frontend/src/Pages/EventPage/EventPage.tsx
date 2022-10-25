import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './EventPage.module.scss';

interface Event {
  title: string;
  start_dt: Date;
  end_dt: Date;
  description_short: string;
  description_long: string;
  publish_dt: Date;
  host: string;
  location: string;
}

const monthNames = [
  'Januar',
  'Februar',
  'Mars',
  'April',
  'May',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event>();

  useEffect(() => {
    const url = 'http://localhost:8000/samfundet/api/events/' + id;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setEvent({
          title: data.title,
          start_dt: data.start_dt,
          end_dt: data.end_dt,
          description_short: data.description_short,
          description_long: data.description_long,
          publish_dt: data.publish_dt,
          host: data.host,
          location: data.location,
        });
      });
  }, [id]);
  return (
    <div className={styles.container}>
      <div>
        <img id="banner-link"></img>
      </div>
      <div className={styles.container_list}>
        <table>
          <tr>
            <td className={styles.table_element_left}> LOKALE </td>
            <td className={styles.table_element_right}> {event?.location} </td>
          </tr>
          <tr>
            <td className={styles.table_element_left}> ARRANGØR </td>
            <td className={styles.table_element_right}> {event?.host} </td>
          </tr>
          <tr>
            <td className={styles.table_element_left}> DATO </td>
            <td className={styles.table_element_right}>
              {' '}
              {event?.start_dt.toString().split('-')[1] + '. '}
              {monthNames[Number(event?.start_dt.toString().split('-')[1]) - 1]}{' '}
            </td>
          </tr>
          <tr>
            <td className={styles.table_element_left}> TID </td>
            <td className={styles.table_element_right}>
              {' '}
              {event?.start_dt.toString().split('-')[2].split('T')[1].split(':00')[0] + ' - '}
              {event?.end_dt.toString().split('-')[2].split('T')[1].split(':00')[0]}
            </td>
          </tr>
          <tr>
            <td className={styles.table_element_left}> BILLETT </td>
            <td className={styles.table_element_right}> STORSALEN </td>
          </tr>
          <tr>
            <td className={styles.table_element_left}> ALDERSGRENSE </td>
            <td className={styles.table_element_right}> STORSALEN </td>
          </tr>
        </table>
      </div>
      <div className={styles.description}>
        <p className={styles.text_title}> DESCRIPTION </p>
        <div className={styles.description}>
          <div className={styles.description_short}>
            <p className={styles.text_short}>{event?.description_short}</p>
          </div>
          <div className={styles.description_long}>
            <p> {event?.description_long}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
