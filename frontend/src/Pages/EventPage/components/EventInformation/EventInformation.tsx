import { useTranslation } from 'react-i18next';
import { TimeDisplay, TimeDuration } from '~/Components';
import type { EventDto } from '~/dto';
import { getEventAgeRestrictionKey } from '../AgeLimitRow/utils';
import { EventInfoWidget } from '../EventInfoWidget';
import styles from './EventInformation.module.scss';

type EventInformationProps = {
  event: EventDto;
};

export function EventInformation({ event }: EventInformationProps) {
  const ageRestrictionKey = getEventAgeRestrictionKey(event.age_restriction);
  const { t } = useTranslation();
  return (
    <div className={styles.event_information_wrapper}>
      <div className={styles.event_information_group}>
        <EventInfoWidget
          icon="carbon:calendar"
          info={<TimeDisplay timestamp={event.start_dt} displayType="nice-date" />}
        />
        <EventInfoWidget icon="carbon:time" info={<TimeDuration start={event.start_dt} end={event.end_dt} />} />
        <EventInfoWidget icon="carbon:location" info={event.location} />
        {event.doors_time && (
          <EventInfoWidget
            icon="carbon:ibm-engineering-requirements-doors-next"
            info={event.doors_time.split(':').slice(0, 2).join(':')}
          />
        )}
        <EventInfoWidget icon="carbon:group" info={event.host} />
        <EventInfoWidget icon="carbon:identification" info={t(ageRestrictionKey)} />
      </div>
      {event.custom_tickets && (
        <div className={styles.event_information_group}>
          {event.custom_tickets.map((ticket, index) => {
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            return <EventInfoWidget key={index} icon="carbon:ticket" info={`${ticket.price},-`} />;
          })}
          {/* Todo add billig prices */}
        </div>
      )}
    </div>
  );
}
