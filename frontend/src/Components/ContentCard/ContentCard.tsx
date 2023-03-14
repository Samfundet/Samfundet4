import { Icon } from '@iconify/react';
import classnames from 'classnames';
import { useId } from 'react';
import { useScreenCenterOffset } from '~/hooks';
import { Button } from '../Button';
import styles from './ContentCard.module.scss';

type ContentCardProps = {
  className?: string;
};

export function ContentCard({ className }: ContentCardProps) {
  const id = useId();
  const scrollY = useScreenCenterOffset(id);

  const scrollContainer = scrollY * 0.03;
  const scrollInfo = scrollY * 0.02;
  const containerTransform = `translateY(${scrollContainer}px)`;
  const infoTransform = `translateY('${scrollInfo}px)`;

  return (
    <div className={classnames(styles.container, className)} style={{ transform: containerTransform }} id={id}>
      <div className={styles.card}>
        <div className={styles.card_image} />
        <div className={styles.card_info} style={{ transform: infoTransform }}>
          <div className={styles.info_header}>Et arrangement</div>
          <div className={styles.info_description}>
            Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet Indeed, it is lorem ipsum
            dolor sit amet, lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet
          </div>
          <div className={styles.info_bottom_row}>
            <Button rounded={true} theme="black">
              <div className={styles.button_content}>
                Kjøp billett
                <Icon icon="mdi:arrow-right" width={18} />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
