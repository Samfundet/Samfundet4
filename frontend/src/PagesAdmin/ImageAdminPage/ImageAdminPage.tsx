import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './ImageAdminPage.module.scss';
import { ImageDto } from '~/dto';
import { getImages } from '~/api';
import { reverse } from '~/named-urls';
import { AdminImage } from './components';

export function ImageAdminPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  // TODO add permissions on render
  useEffect(() => {
    getImages()
      .then((data) => {
        console.log(data);
        setImages(data);
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
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>{t(KEY.admin_images_title)}</h1>
        <Link target="backend" url={ROUTES.backend.admin__samfundet_image_changelist}>
          View in backend
        </Link>
      </div>
      <Button theme="success" onClick={() => navigate(ROUTES.frontend.admin_gangs_create)}>
        {t(KEY.admin_images_create)}
      </Button>
      <div className={styles.line} />
      <h2 className={styles.subHeader}>{t(KEY.common_results)}</h2>
      <div className={styles.imageContainer}>
        {images.map(function (element, key) {
          return (
            <AdminImage image={element} className={styles.imageBox} />
          );
        })}
      </div>
    </Page>
  );
}
