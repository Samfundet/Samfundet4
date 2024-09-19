import classNames from 'classnames';
import { useState } from 'react';
import type { Children } from '~/types';
import { Image } from '../Image';
import styles from './ToolTip.module.scss';

type AlignmentOptions = 'top' | 'right';
type DisplayOptions = 'text' | 'image';
type ToolTipProps = {
  alignment?: AlignmentOptions;
  display?: DisplayOptions;
  value?: string;
  children: Children;
};

export function ToolTip({ value = 'Jokes on you', display = 'text', alignment = 'top', children }: ToolTipProps) {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <div>
      <div style={{ position: 'relative' }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {children}
        <div
          className={classNames(
            styles.tooltip,
            alignment === 'top' ? styles.top : styles.left,
            !hover && styles.hidden,
          )}
        >
          {display === 'text' ? <p>{value}</p> : <Image className={styles.noMargin} src={value} />}
        </div>
      </div>
    </div>
  );
}
