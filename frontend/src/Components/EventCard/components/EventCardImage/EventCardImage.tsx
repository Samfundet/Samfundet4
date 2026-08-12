import { type HTMLAttributes, useMemo } from 'react';
import eventPlaceholder from '~/assets/event_placeholder.jpg';
import { BACKEND_DOMAIN } from '~/constants';
import { backgroundImageFromUrl } from '~/utils';
import styles from './EventCardImage.module.scss';

type EventCardImageProps = HTMLAttributes<HTMLDivElement> & {
  imageUrl?: string;
};

export function EventCardImage(props: EventCardImageProps) {
  const imageUrl = useMemo(() => {
    if (props.imageUrl) {
      if (props.imageUrl.startsWith('http')) {
        return props.imageUrl;
      }
      return BACKEND_DOMAIN + props.imageUrl;
    }
    return eventPlaceholder;
  }, [props]);

  return <div style={backgroundImageFromUrl(imageUrl)} className={styles.image} />;
}
