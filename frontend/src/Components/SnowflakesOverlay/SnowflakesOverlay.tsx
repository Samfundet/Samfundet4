import styles from './SnowflakesOverlay.module.scss';

type SnowflakesOverlayProps = {
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
};

const SNOWFLAKE_SYMBOLS = ['❅', '❆', '❅', '❆', '❅', '❆', '❅', '❆', '❅', '❆', '❅', '❆'];

export function SnowflakesOverlay({ intensity = 'low' }: SnowflakesOverlayProps) {
  let snowflakes = SNOWFLAKE_SYMBOLS;

  switch (intensity) {
    case 'medium':
      snowflakes = [...snowflakes, ...SNOWFLAKE_SYMBOLS];
      break;
    case 'high':
      snowflakes = [...snowflakes, ...SNOWFLAKE_SYMBOLS, ...SNOWFLAKE_SYMBOLS];
      break;
    case 'extreme':
      snowflakes = [...snowflakes, ...SNOWFLAKE_SYMBOLS, ...SNOWFLAKE_SYMBOLS, ...SNOWFLAKE_SYMBOLS];
      break;
    default:
      break;
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
