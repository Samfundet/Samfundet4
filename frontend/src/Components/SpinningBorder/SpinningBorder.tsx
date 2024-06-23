import classnames from 'classnames';
import { type Children, COLORS } from '~/types';
import { getGlobalBackgroundColor } from '~/utils';
import styles from './SpinningBorder.module.scss';

type SpinningBorderProps = {
  speed?: string;
  width?: string;
  backgroundColor?: string;
  padding?: string;
  radius?: string;
  colors?: string[];
  className?: string;
  children?: Children;
};

export function SpinningBorder({
  radius = '0%',
  width = '200px',
  padding = '8px',
  backgroundColor = getGlobalBackgroundColor(),
  colors = [COLORS.red_samf, COLORS.orange_light],
  speed = '3s',
  className,
  children,
}: SpinningBorderProps) {
  const parsedColors = colors?.join(',');
  return (
    <div className={classnames(className, styles.outer)} style={{ padding: padding, borderRadius: radius }}>
      <div
        className={styles.spinner}
        style={{
          animationDuration: speed,
          borderRadius: radius,
          background: `linear-gradient(to right, ${parsedColors})`,
        }}
      />
      <div
        className={classnames(styles.inner)}
        style={{ width: width, height: width, background: backgroundColor, borderRadius: radius }}
      >
        {children}
      </div>
    </div>
  );
}
