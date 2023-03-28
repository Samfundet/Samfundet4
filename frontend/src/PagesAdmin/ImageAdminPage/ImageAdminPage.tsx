import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getImages } from '~/api';
import { Button, ImageQuery, Link, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { ImageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminImage } from './components';
import styles from './ImageAdminPage.module.scss';

export function ImageAdminPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageDto[]>([]);
  const [allImages, setAllImages] = useState<ImageDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  // TODO add permissions on render
  useEffect(() => {
    getImages()
      .then((data) => {
        setImages(data);
        setAllImages(data);
        setShowSpinner(false);
      })
      .catch(console.error);
  }, []);

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }
  // TODO ADD TRANSLATIONS pr element
  return (
    <Page>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>{t(KEY.admin_images_title)}</h1>
        <Link target="backend" url={ROUTES.backend.admin__samfundet_image_changelist}>
          View in backend
        </Link>
      </div>
      <div className={styles.action_row}>
        <Button theme="success" rounded={true} onClick={() => navigate(ROUTES.frontend.admin_images_create)}>
          {t(KEY.admin_images_create)}
        </Button>
        <ImageQuery allImages={allImages} setImages={setImages} />
      </div>
      <div className={styles.imageContainer}>
        {images.map(function (element, key) {
          return <AdminImage key={key} image={element} className={styles.imageBox} />;
        })}
      </div>
    </Page>
  );
}
