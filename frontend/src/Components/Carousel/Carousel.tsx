import classnames from 'classnames';
import { ReactNode } from 'react';
import styles from './Carousel.module.scss';

type CarouselProps = {
  children: Array<ReactNode>;
  header: string;
  spacing?: number;
};

export function Carousel({ children, header, spacing }: CarouselProps) {
  const wrappedChildren = children.map((child: ReactNode, idx: number) => {
    return (
      <div className={styles.itemContainer} style={{ padding: (spacing ? spacing : 0.2) + 'em' }} key={idx}>
        {child}
      </div>
    );
  });

  return (
    <div className={styles.carousel}>
      <div className={styles.header}>{header}</div>
      <div className={styles.container}>
        <div className={styles.navContainer}>
          <div className={classnames(styles.button, styles.left)}>{'<'}</div>
        </div>
        <div className={classnames(styles.navButton, styles.left)}></div>
        <div className={styles.scroller}>{wrappedChildren}</div>
        <div className={styles.navContainer}>
          <div className={classnames(styles.button, styles.right)}>{'>'}</div>
        </div>
      </div>
    </div>
  );
}
