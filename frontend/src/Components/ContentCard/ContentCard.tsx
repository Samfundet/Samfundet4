import { Icon } from '@iconify/react';
import classnames from 'classnames';
import { useId } from 'react';
import { useScreenCenterOffset } from '~/hooks';
import { backgroundImageFromUrl } from '~/utils';
import { Button } from '../Button';
import styles from './ContentCard.module.scss';

type ContentCardProps = {
  className?: string;
  title: string;
  description: string;
  buttonText?: string;
  url?: string;
  imageUrl?: string;
};

export function ContentCard({ className, title, description, buttonText, url, imageUrl }: ContentCardProps) {
  const id = useId();
  const scrollY = useScreenCenterOffset(id);

  const scrollContainer = scrollY * 0.03;
  const scrollInfo = scrollY * 0.02;
  const containerTransform = `translateY(${scrollContainer}px)`;
  const infoTransform = `translateY('${scrollInfo}px)`;

  function followLink(url: string) {
    window.location.href = url;
  }

  return (
    <div className={classnames(styles.container, className)} style={{ transform: containerTransform }} id={id}>
      <div className={styles.card}>
        <div className={styles.card_image} style={backgroundImageFromUrl(imageUrl)} />
        <div className={styles.card_info} style={{ transform: infoTransform }}>
          <div className={styles.info_header}>{title}</div>
          <div className={styles.info_description}>{description}</div>
          {buttonText && (
            <div className={styles.info_bottom_row}>
              <Button rounded={true} theme="black" onClick={() => followLink(url ?? '#')}>
                <div className={styles.button_content}>
                  <span>{buttonText}</span>
                  <Icon icon="mdi:arrow-right" width={18} />
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
