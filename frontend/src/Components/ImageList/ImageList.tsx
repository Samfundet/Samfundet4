import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { dbT } from '~/i18n/i18n';
import { Image } from '../Image';
import styles from './ImageList.module.scss';

type Image = {
  src: string;
  url?: string;
  name?: string;
  name_nb?: string;
  name_en?: string;
  short?: string;
  alt?: string;
};

type ImageListProps = {
  images: Image[];
  size?: number;
  textClassName?: string;
  textMaxLength?: number;
};

/**
 * images: Array of image objects
 * {title: String title of image, src: source of image, url: redirection of image}
 * TODO May need to add validation if image exists
 */
export function ImageList({ images, size, textClassName, textMaxLength }: ImageListProps) {
  const { i18n } = useTranslation();
  return (
    <div className={styles.container}>
      {images.map((element, key) => (
        <a key={key} className={styles.imageBox} href={element.url}>
          <div className={styles.imageMask} style={{ width: size, height: size }}>
            <Image src={element.src} className={styles.image} alt={element.alt} altText={true} />
          </div>
          <p className={classNames(styles.label, textClassName)}>
            {textMaxLength && dbT(element, 'name', i18n.language).length > textMaxLength
              ? element.short
              : dbT(element, 'name', i18n.language)}
          </p>
        </a>
      ))}
    </div>
  );
}
