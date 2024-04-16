import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton } from '~/Components';
import { BACKEND_DOMAIN } from '~/constants';
import { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { COLORS, PAID_TICKET_TYPES } from '~/types';
import { dbT, lowerCapitalize } from '~/utils';
import styles from '../../HomePage.module.scss';

type Size = 'normal' | 'small';

type SplashProps = {
  events?: EventDto[];
  showInfo?: boolean;
  showButtons?: boolean;
  size?: Size;
};

// Milliseconds between each slide
const SLIDE_FREQUENCY = 5_000;

export function Splash({ events, showInfo, showButtons = true, size = 'normal' }: SplashProps) {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBackwards, setIsBackwards] = useState(false);

  const [index, setIndex] = useState<number>(0);
  const nextIndex = events ? (index + 1) % events?.length : 0;
  const prevIndex = events ? (index - 1 + events.length) % events.length : 0;

  const imageUrl = events ? BACKEND_DOMAIN + events[index].image_url : '';
  const nextImageUrl = events ? BACKEND_DOMAIN + events[nextIndex].image_url : '';
  const prevImageUrl = events ? BACKEND_DOMAIN + events[prevIndex].image_url : '';

  const description = events ? dbT(events[index], 'description_short') : '';

  const isPaid = events && PAID_TICKET_TYPES.includes(events[index].ticket_type);

  const ticketButton = isPaid ? (
    <Button theme={'samf'} className={styles.ticket_button}>
      <Icon icon="ph:ticket-bold" />
      {lowerCapitalize(`${t(KEY.common_buy)} ${t(KEY.common_ticket_type)}`)}
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
    setIsBackwards(false);
    if (isBackwards) {
      setIndex(prevIndex);
    } else {
      setIndex(nextIndex);
    }
    startSlideTimer();
  }

  function onClickNext() {
    setIsAnimating(true);
  }

  function onClickPrev() {
    setIsBackwards(true);
    setIsAnimating(true);
  }

  // Start timer when events change
  useEffect(() => {
    startSlideTimer();
  }, [events, startSlideTimer]);

  return (
    <div
      className={classNames({
        [styles.splash_container]: true,
        [styles.splash_container_small]: size === 'small',
        [styles.splash_fade]: true,
      })}
    >
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
      {showButtons && (
        <>
          <IconButton
            icon="ooui:next-rtl"
            title="prev"
            color={COLORS.transparent}
            height="5em"
            onClick={onClickPrev}
            className={styles.splash_change_button}
          />
          <IconButton
            icon="ooui:next-ltr"
            title="next"
            height="5em"
            color={COLORS.transparent}
            onClick={onClickNext}
            className={classNames({ [styles.splash_change_button]: true, [styles.next]: true })}
          />
        </>
      )}

      <img
        src={imageUrl}
        className={classNames({
          [styles.splash]: true,
          [styles.splash_slide_out]: isAnimating && !isBackwards,
          [styles.splash_slide_out_reverse]: isAnimating && isBackwards,
        })}
        onAnimationEnd={nextSplash}
      />
      <img
        src={isBackwards ? prevImageUrl : nextImageUrl}
        className={classNames({
          [styles.splash]: true,
          [styles.splash_second]: true,
          [styles.splash_slide_in]: isAnimating && !isBackwards,
          [styles.splash_slide_in_reverse]: isAnimating && isBackwards,
        })}
      />

      <div className={styles.splash_fade}></div>
    </div>
  );
}
