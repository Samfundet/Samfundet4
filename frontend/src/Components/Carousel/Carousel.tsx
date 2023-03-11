import classnames from 'classnames';
import { Children } from '~/types';
import styles from './Carousel.module.scss';

type CarouselProps = {
  children: Array<Children>;
  header?: string;
  spacing?: number;
};

export function Carousel({ children, header, spacing }: CarouselProps) {

  const wrappedChildren = children.map((child: Children, idx: number) => {
    return (
      <div className={styles.itemContainer} key={idx}>
        {child}
      </div>
    );
  });

  const wrappedPadding = (
    <div className={styles.itemContainer} style={{ opacity: 0, pointerEvents: "none" }}>
      {children[children.length - 1]}
    </div>
  );

  return (
    <div className={styles.carousel}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.container}>
        <div className={styles.navContainer}>
          <div className={classnames(styles.button, styles.left)}>{'<'}</div>
        </div>
        <div className={classnames(styles.navButton, styles.left)}></div>
        <div className={styles.scroller} style={{ gap: (spacing ? spacing : 0.2) + 'em' }}>
          {wrappedChildren}
          {wrappedPadding}
        </div>
        <div className={styles.navContainer}>
          <div className={classnames(styles.button, styles.right)}>{'>'}</div>
        </div>
      </div>
    </div>
  );
}
