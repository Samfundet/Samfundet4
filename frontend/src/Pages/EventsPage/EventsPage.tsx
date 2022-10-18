import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventsPage.module.scss';

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

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [prevDate, setPrevDate] = useState('');
  const [dates, setDates] = useState<string[]>([]);
  useEffect(() => {
    console.log('Running useeffect');
    fetch('http://localhost:8000/samfundet/api/events/')
      .then((response) => response.json())
      .then((data) => {
        const events = data;
        setEvents(events);
        console.log(events);
        setDates([]);
        events.map((event: any) => {
          //const isPresent = false;
          //   dates.map((date: any) => {
          //     console.log(
          //       'Second part of if: ' + date.toString().toString().split('-')[0] + date.toString().split('-')[1],
          //     );
          //     if (
          //       event.start_dt.toString().split('-')[0] + event.start_dt.toString().split('-')[1] ==
          //       date.toString().toString().split('-')[0] + date.toString().split('-')[1]
          //     ) {
          //       isPresent = true;
          //     } else {
          //       console.log('is not present!');
          //     }
          //   });
          console.log('prev date: ' + prevDate);
          console.log(
            'Index of bool: ' +
              dates.indexOf(
                event.start_dt.toString().split('-')[1] + '-' + event.start_dt.toString().split('-')[2].split('T')[0],
              ),
          );
          if (
            dates.indexOf(
              event.start_dt.toString().split('-')[1] + '-' + event.start_dt.toString().split('-')[2].split('T')[0],
            ) == -1 &&
            event.start_dt.toString().split('-')[1] + '-' + event.start_dt.toString().split('-')[2].split('T')[0] !=
              prevDate
          ) {
            setDates((prevEvents) => [
              ...prevEvents,
              event.start_dt.toString().split('-')[1] + '-' + event.start_dt.toString().split('-')[2].split('T')[0],
            ]);
            setPrevDate(
              event.start_dt.toString().split('-')[1] + '-' + event.start_dt.toString().split('-')[2].split('T')[0],
            );
            console.log(
              'Added date: ' +
                event.start_dt.toString().split('-')[1] +
                '-' +
                event.start_dt.toString().split('-')[2].split('T')[0],
            );
          }
        });
        console.log(dates);
      });
    console.log(dates);
    const tempArray: string[] = [];
    dates.forEach((date: string) => {
      console.log('date in foreach: ' + date);
      if (tempArray.indexOf(date) == -1) {
        tempArray.push(date);
        console.log('Pushed date: ' + date);
      }
    });
    setDates(tempArray);
  }, []);
  return (
    <div className={styles.container}>
      {dates.map((date: any) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <div className={styles.dates_container}>
            <div className={styles.events_container}>
              <h2>
                {date}
                {monthNames[Number(date.toString().split('-')[1]) - 1]}{' '}
              </h2>
              {events.map((event: any) => {
                console.log(
                  'lol' +
                    event.start_dt.toString().split('-')[1] +
                    '-' +
                    event.start_dt.toString().split('-')[2].split('T')[0],
                );
                console.log('date: ' + date);
                if (
                  event.start_dt.toString().split('-')[1] +
                    '-' +
                    event.start_dt.toString().split('-')[2].split('T')[0] ==
                  date
                ) {
                  // eslint-disable-next-line react/jsx-key
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <Link to={'/events/' + event.id}>
                      {' '}
                      <p> {event.title}</p>{' '}
                    </Link>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
