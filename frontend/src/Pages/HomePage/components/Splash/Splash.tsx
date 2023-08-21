import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BACKEND_DOMAIN } from '~/constants';
import { EventDto } from '~/dto';
import styles from '../../HomePage.module.scss';
import { dbT } from '~/utils';
import { Button } from '~/Components';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { Icon } from '@iconify/react';
import { PAID_TICKET_TYPES } from '~/types';
import { ROUTES } from '~/routes';
import { reverse } from '~/named-urls';

type SplashProps = {
  events?: EventDto[];
  showInfo?: boolean;
};

// Milliseconds between each slide
const SLIDE_FREQUENCY = 5_000;

export function Splash({ events, showInfo }: SplashProps) {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);

  const [index, setIndex] = useState<number>(0);
  const nextIndex = events ? (index + 1) % events?.length : 0;

  const imageUrl = events ? BACKEND_DOMAIN + events[index].image_url : '';
  const nextImageUrl = events ? BACKEND_DOMAIN + events[nextIndex].image_url : '';

  const description = events ? dbT(events[index], 'description_short') : '';

  const isPaid = events && PAID_TICKET_TYPES.includes(events[index].ticket_type);

  const ticketButton = isPaid ? (
    <Button theme={'samf'} className={styles.ticket_button}>
      <Icon icon="ph:ticket-bold" />
      {`${t(KEY.common_buy)} ${t(KEY.common_ticket_type)}`}
    </Button>
  ) : (
    <></>
  );

  const infoButton = events && (
    <Button
      link={reverse({
        pattern: ROUTES.frontend.event,
        urlParams: { id: events[index].id },
      })}
    >
      <Icon icon="ic:outline-info" />
      <span>{t(KEY.common_more_info)}</span>
    </Button>
  );

  const slideTimeout = useRef<NodeJS.Timeout>();

  const startSlideTimer = useCallback(() => {
    // Cancel previous if any
    if (slideTimeout.current != undefined) {
      clearTimeout(slideTimeout.current);
    }
    // Start new timeout
    if (events && events.length > 1) {
      slideTimeout.current = setTimeout(() => {
        setIsAnimating(true);
      }, SLIDE_FREQUENCY);
    }
  }, [events, setIsAnimating]);

  function nextSplash() {
    setIsAnimating(false);
    setIndex((val) => (val + 1) % (events?.length ?? 0));
    startSlideTimer();
  }

  // Start timer when events change
  useEffect(() => {
    startSlideTimer();
  }, [events, startSlideTimer]);

  return (
    <div className={styles.splash_container}>
      {showInfo && (
        <div className={styles.splash_info_wrapper}>
          <div className={styles.splash_info}>
            <span className={styles.splash_description}>{description}</span>
            <div className={styles.splash_buttons}>
              {ticketButton}
              {infoButton}
            </div>
          </div>
        </div>
      )}
      <img
        src={imageUrl}
        className={classNames({ [styles.splash]: true, [styles.splash_slide_out]: isAnimating })}
        onAnimationEnd={nextSplash}
      />
      <img
        src={nextImageUrl}
        className={classNames({
          [styles.splash]: true,
          [styles.splash_second]: true,
          [styles.splash_slide_in]: isAnimating,
        })}
      />
      <div className={styles.splash_fade}></div>
    </div>
  );
}
