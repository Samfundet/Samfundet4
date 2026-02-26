import classNames from 'classnames';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/Components/Button/Button';
import { BACKEND_DOMAIN } from '~/constants';
import type { ImageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { backgroundImageFromUrl, lowerCapitalize } from '~/utils';
import styles from './AdminImage.module.scss';

type AdminImageProps = {
  image: ImageDto;
  className?: string;
};

export function AdminImage({ image, className }: AdminImageProps) {
  const navigate = useNavigate();

  const editImageUrl = reverse({
    pattern: ROUTES.frontend.admin_images_edit,
    urlParams: { id: image.id },
  });

  const header = (
    <>
      <Button theme="success" rounded={true} onClick={() => navigate(editImageUrl)}>
        {lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.common_image)}`)}
      </Button>
    </>
  );

  const TAGS = image.tags
    .map((tag) => {
      return ` ${tag.name}`;
    })
    .toString();

  return (
    <div
      className={classNames(styles.imageContainer, className)}
      style={backgroundImageFromUrl(BACKEND_DOMAIN + image.url)}
    >
      <div className={styles.imageTitle}>
        <p className={styles.text}>{image.title}</p>
        <p className={styles.tags}>{TAGS}</p>
        {header}
      </div>
    </div>
  );
}
