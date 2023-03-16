import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { dbT } from '~/i18n/i18n';
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
  const { i18n } = useTranslation();

  function getImageText(element: Record<string, string>) {
    if (textMaxLength && (dbT(element, 'name', i18n.language) as string).length > textMaxLength) {
      return element.short;
    }
    return dbT(element, 'name', i18n.language);
  }

  return (
    <div className={styles.container}>
      {images.map((element, key) => (
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
