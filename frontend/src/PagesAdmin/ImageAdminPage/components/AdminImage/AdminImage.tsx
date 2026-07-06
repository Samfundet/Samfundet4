import classNames from 'classnames';
import { Link } from '~/Components';
import type { ImageDto } from '~/dto';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { backgroundImageFromUrl, imageUrl } from '~/utils';
import styles from './AdminImage.module.scss';

type AdminImageProps = {
  image: ImageDto;
  className?: string;
};

export function AdminImage({ image, className }: AdminImageProps) {
  const TAGS = image.tags
    .map((tag) => {
      return ` ${tag.name}`;
    })
    .toString();
  return (
    <Link
      url={reverse({ pattern: ROUTES.frontend.admin_images_detail, urlParams: { id: image.id } })}
      plain={true}
      className={classNames(styles.imageContainer, className)}
      style={backgroundImageFromUrl(imageUrl(image, 'small'))}
    >
      <div className={styles.imageTitle}>
        <p className={styles.text}>{image.title}</p>
        <p className={styles.tags}>{TAGS}</p>
      </div>
    </Link>
  );
}
