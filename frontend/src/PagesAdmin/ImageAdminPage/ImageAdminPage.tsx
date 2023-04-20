import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, ImageQuery, Link, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { getImages } from '~/api';
import { ImageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './ImageAdminPage.module.scss';
import { AdminImage } from './components';

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
          {t(KEY.common_see_in_django_admin)}
        </Link>
      </div>
      <div className={styles.action_row}>
        <ImageQuery allImages={allImages} setImages={setImages} />
        <Button theme="success" rounded={true} onClick={() => navigate(ROUTES.frontend.admin_images_create)}>
          {t(KEY.admin_images_create)}
        </Button>
      </div>
      <div className={styles.imageContainer}>
        {images.map(function (element) {
          return <AdminImage key={element.id} image={element} className={styles.imageBox} />;
        })}
      </div>
    </Page>
  );
}
