import classNames from 'classnames';
import type { ReactNode } from 'react';
import { Skeleton } from '~/Components/Skeleton';
import type { Children } from '~/types';
import styles from './Carousel.module.scss';

type CarouselProps = {
  children: Array<Children>;
  header?: ReactNode;
  spacing?: number;
  className?: string;
  itemContainerClass?: string;
  headerClass?: string;
};

export function Carousel({
  children,
  className,
  itemContainerClass,
  headerClass,
  header = <Skeleton width={'8em'} />,
  spacing,
}: CarouselProps) {
  const wrappedChildren = children.map((child: Children, idx: number) => {
    return (
      <div className={classNames(styles.itemContainer, itemContainerClass)} key={idx}>
        {child}
      </div>
    );
  });

  return (
    <div className={className}>
      {header !== '' && (
        <div className={styles.headerWrapper}>
          <div className={classNames(styles.header, headerClass)}>{header}</div>
        </div>
      )}
      <div>
        <div className={styles.navContainer}>
          <div className={classNames(styles.button, styles.left)}>{'<'}</div>
        </div>
        <div className={classNames(styles.navButton, styles.left)} />
        <div className={styles.scroller} style={{ gap: `${spacing ? spacing : 0.2}em` }}>
          {wrappedChildren}
        </div>
        <div className={styles.navContainer}>
          <div className={classNames(styles.button, styles.right)}>{'>'}</div>
        </div>
      </div>
    </div>
  );
}
