import styles from './SnowflakesOverlay.module.scss';

type SnowflakesOverlayProps = {
  intensity: 'low' | 'medium' | 'high' | 'extreme';
};

const SNOWFLAKE_SYMBOLS = ['❅', '❆', '❅', '❆', '❅', '❆', '❅', '❆', '❅', '❆', '❅', '❆'];

export function SnowflakesOverlay({ intensity = 'low' }: SnowflakesOverlayProps) {
  // increase the number of snowflakes based on intensity
  let snowflakes = SNOWFLAKE_SYMBOLS;
  if (intensity === 'medium') {
    snowflakes = [...snowflakes, ...snowflakes];
  } else if (intensity === 'high') {
    snowflakes = [...snowflakes, ...snowflakes, ...snowflakes];
  } else if (intensity === 'extreme') {
    snowflakes = [...snowflakes, ...snowflakes, ...snowflakes, ...snowflakes];
  }

  return (
    <div className={styles.snowflakes} aria-hidden="true">
      {snowflakes.map((symbol, index) => (
        <div key={index} className={styles.snowflake}>
          {symbol}
        </div>
      ))}
    </div>
  );
}
