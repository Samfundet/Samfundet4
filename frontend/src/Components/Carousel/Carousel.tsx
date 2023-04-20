import classnames from 'classnames';
import { ReactNode } from 'react';
import { Skeleton } from '~/Components/Skeleton';
import { Children } from '~/types';
import styles from './Carousel.module.scss';

type CarouselProps = {
  children: Array<Children>;
  header?: ReactNode;
  spacing?: number;
  className?: string;
};

export function Carousel({ children, className, header = <Skeleton width={'8em'} />, spacing }: CarouselProps) {
  const wrappedChildren = children.map((child: Children, idx: number) => {
    return (
      <div className={styles.itemContainer} key={idx}>
        {child}
      </div>
    );
  });

  return (
    <div className={className}>
      <div className={styles.headerWrapper}>
        <div className={styles.header}>{header}</div>
      </div>
      <div>
        <div className={styles.navContainer}>
          <div className={classnames(styles.button, styles.left)}>{'<'}</div>
        </div>
        <div className={classnames(styles.navButton, styles.left)}></div>
        <div className={styles.scroller} style={{ gap: (spacing ? spacing : 0.2) + 'em' }}>
          {wrappedChildren}
        </div>
        <div className={styles.navContainer}>
          <div className={classnames(styles.button, styles.right)}>{'>'}</div>
        </div>
      </div>
    </div>
  );
}
