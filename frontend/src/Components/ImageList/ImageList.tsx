import { Image } from '../Image';
import styles from './ImageList.module.scss';

type ImageListProps = {
  images: Array;
  size?: number;
};

/**
 * images: Array of image objects
 * {title: String title of image, src: source of image, url: redirection of image}
 * TODO May need to add validation if image exists
 */
export function ImageList({ images, size }: ImageListProps) {
  return (
    <div className={styles.container}>
      {images.map((element, key) => (
        <a key={key} className={styles.imageBox} href={element.url}>
          <div className={styles.imageMask} style={{ width: size, height: size }}>
            <Image src={element.src} className={styles.image} />
          </div>
          <p className={styles.label}>{element.title}</p>
        </a>
      ))}
    </div>
  );
}
