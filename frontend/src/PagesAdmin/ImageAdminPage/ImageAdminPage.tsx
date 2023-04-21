import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, ImageQuery } from '~/Components';
import { getImages } from '~/api';
import { ImageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
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

  const title = t(KEY.admin_images_title);
  const backendUrl = ROUTES.backend.admin__samfundet_image_changelist;
  const header = (
    <Button theme="success" rounded={true} onClick={() => navigate(ROUTES.frontend.admin_images_create)}>
      {t(KEY.admin_images_create)}
    </Button>
  );
  
  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <div className={styles.action_row}>
        <ImageQuery allImages={allImages} setImages={setImages} />
      </div>
      <div className={styles.imageContainer}>
        {images.map(function (element) {
          return <AdminImage key={element.id} image={element} className={styles.imageBox} />;
        })}
      </div>
    </AdminPageLayout>
  );
}
