import { Icon } from '@iconify/react';
import classnames from 'classnames';
import { type ReactNode, useId } from 'react';
import { Skeleton } from '~/Components';
import { useScreenCenterOffset } from '~/hooks';
import { backgroundImageFromUrl } from '~/utils';
import { Button } from '../Button';
import styles from './ContentCard.module.scss';

type ContentCardProps = {
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  buttonText?: string;
  url?: string;
  imageUrl?: string;
  isSkeleton?: boolean;
};

export function ContentCard({
  className,
  title = <Skeleton />,
  description = <Skeleton />,
  buttonText,
  url,
  isSkeleton,
  imageUrl,
}: ContentCardProps) {
  const id = useId();
  const scrollY = useScreenCenterOffset(id);

  const scrollContainer = scrollY * 0.03;
  const scrollInfo = scrollY * 0.02;
  const containerTransform = `translateY(${scrollContainer}px)`;
  const infoTransform = `translateY('${scrollInfo}px)`;

  function followLink(url: string) {
    window.location.href = url;
  }

  if (isSkeleton) {
    return (
      <div className={styles.skeleton_wrapper}>
        <Skeleton height={'100%'} borderRadius={'1em'} />
      </div>
    );
  }

  return (
    <div className={classnames(styles.container, className)} style={{ transform: containerTransform }} id={id}>
      <div className={styles.card}>
        {/* Image */}
        <div className={styles.card_image} style={backgroundImageFromUrl(imageUrl)} />

        {/* Text */}
        <div className={styles.card_info} style={{ transform: infoTransform }}>
          <div className={styles.info_header}>{title}</div>
          <div className={styles.info_description}>{description}</div>
          {buttonText && (
            <div className={styles.info_bottom_row}>
              <Button className={styles.btn} rounded={true} theme="black" onClick={() => followLink(url ?? '#')}>
                {buttonText}
                <Icon className={styles.icon} icon="mdi:arrow-right" width={18} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
