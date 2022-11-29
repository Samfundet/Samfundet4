import { Image } from '../Image';
import styles from './ImageList.module.scss';

type ImageListProps = {
  images: Array;
  size?: number;
};

/**
 * 
 * May need to add validation if image exists
 */
export function ImageList({ images, size }: ImageListProps) {
  return (
    <div className={styles.container}>
      {images.map(function (element, key) {
        return (
          <a key={key} className={styles.imageBox}>
            <div className={styles.imageMask} style={{width:size, height:size}}>
              <Image src={element.src} className={styles.image} />
            </div>
            <p className={styles.label}>{element.title}</p>
          </a>
        );
      })}
    </div>
  );
}
