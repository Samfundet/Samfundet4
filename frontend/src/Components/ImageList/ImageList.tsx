import { Image } from '../Image';
import styles from './ImageList.module.scss';

type ImageListProps = {
  images: Array;
  size?: number;
};

/**
 * 
 * src, height, width, alt, className
 */
export function ImageList({ images, size }: ImageListProps) {
  return (
    <div className={styles.container} >
        {images.map(function (element, key) {
          return (     
            <a key={key} className={styles.imageBox}>
              <Image src={element.src} width={size} height={size} className={styles.image}/>
              <p className={styles.label}>{element.title}</p>
            </a>
          )
        })}
    </div>
  );
}
