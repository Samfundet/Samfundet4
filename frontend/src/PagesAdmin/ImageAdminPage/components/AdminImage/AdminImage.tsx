import { Link } from '~/Components';
import { BACKEND_DOMAIN } from '~/constants';
import { ImageDto } from '~/dto';
import { backgroundImageFromUrl } from '~/utils';
import styles from './AdminImage.module.scss';

type AdminImageProps = {
  image: ImageDto;
  className?: string;
};

export function AdminImage({ image, className }: AdminImageProps) {
  const TAGS = image.tags
    .map((tag) => {
      return ' ' + tag.name;
    })
    .toString();
  return (
    <Link url="" className={className}>
      <div className={styles.imageContainer} style={backgroundImageFromUrl(BACKEND_DOMAIN + image.url)}>
        <div className={styles.imageTitle}>
          <p className={styles.text}>{image.title}</p>
          <p className={styles.tags}>{TAGS}</p>
        </div>
      </div>
    </Link>
  );
}
