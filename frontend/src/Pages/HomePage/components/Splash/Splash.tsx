import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { BACKEND_DOMAIN } from '~/constants';
import { EventDto } from '~/dto';
import styles from '../../HomePage.module.scss';

type SplashProps = {
  events?: EventDto[];
};

// Milliseconds between each slide
const SLIDE_FREQUENCY = 5_000;

export function Splash({ events }: SplashProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const [index, setIndex] = useState<number>(0);
  const nextIndex = events ? (index + 1) % events?.length : 0;

  const imageUrl = events ? BACKEND_DOMAIN + events[index].image_url : '';
  const nextImageUrl = events ? BACKEND_DOMAIN + events[nextIndex].image_url : '';

  const slideTimeout = useRef<NodeJS.Timeout>();

  function startSlideTimer() {
    // Cancel previous if any
    if (slideTimeout.current != undefined) {
      clearTimeout(slideTimeout.current);
    }
    // Start new timeout
    slideTimeout.current = setTimeout(() => {
      setIsAnimating(true);
    }, SLIDE_FREQUENCY);
  }

  function nextSplash() {
    setIsAnimating(false);
    setIndex((val) => (val + 1) % (events?.length ?? 0));
    startSlideTimer();
  }

  // Start timer when events change
  useEffect(() => {
    startSlideTimer();
  }, [events]);

  return (
    <div className={styles.splash_container}>
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
