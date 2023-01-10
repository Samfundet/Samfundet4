import { Link } from '~/Components';
import { ImageDto } from '~/dto';
import styles from './AdminImage.module.scss';

type AdminImageProps = {
  image: ImageDto;
  className?: string;
};

export function AdminImage({ image, className }: AdminImageProps) {
  const BACKGROUND_IMAGE = `url(${image.image})`;

  const TAGS = image.tags
    .map((tag) => {
      return ' ' + tag.name;
    })
    .toString();
  return (
    <Link url="" className={className}>
      <div className={styles.imageContainer} style={{ backgroundImage: BACKGROUND_IMAGE }}>
        <div className={styles.imageTitle}>
          <p className={styles.text}>{image.title}</p>
          <p className={styles.tags}>{TAGS}</p>
        </div>
      </div>
    </Link>
  );
}
