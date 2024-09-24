import classNames from 'classnames';
import { dbT } from '~/utils';
import { Image } from '../Image';
import styles from './ImageList.module.scss';

export type ImageProps = {
  src: string;
  url?: string;
  name?: string;
  name_nb?: string;
  name_en?: string;
  short?: string;
  alt?: string;
};

type ImageListProps = {
  images: ImageProps[];
  size?: number;
  textClassName?: string;
  textMaxLength?: number;
};

export function ImageList({ images, size, textClassName, textMaxLength }: ImageListProps) {
  function getImageText(element: ImageProps) {
    const name = dbT(element, 'name');
    const isLongerThanMax = textMaxLength && name && name.length > textMaxLength;

    if (isLongerThanMax) {
      return element.short;
    }

    return name;
  }

  return (
    <div className={styles.container}>
      {images.map((element, key) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
        <a key={key} className={styles.imageBox} href={element.url}>
          <div className={styles.imageMask} style={{ width: size, height: size }}>
            <Image src={element.src} className={styles.image} alt={element.alt} />
          </div>
          <p className={classNames(styles.label, textClassName)}>{getImageText(element)}</p>
        </a>
      ))}
    </div>
  );
}
