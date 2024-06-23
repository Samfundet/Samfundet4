import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ImageQuery } from '~/Components';
import { getImages } from '~/api';
import type { ImageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ImageAdminPage.module.scss';
import { AdminImage } from './components';

export function ImageAdminPage() {
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
    <Button theme="success" rounded={true} link={ROUTES.frontend.admin_images_create}>
      {lowerCapitalize(t(KEY.admin_images_create))}
    </Button>
  );

  // Limit maximum number of rendered images
  // TODO pagination & lazy load
  const displayImages = images.slice(0, Math.min(images.length, 64));

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <div className={styles.action_row}>
        <ImageQuery allImages={allImages} setImages={setImages} />
      </div>
      <div className={styles.imageContainer}>
        {displayImages.map((element) => (
          <AdminImage key={element.id} image={element} className={styles.imageBox} />
        ))}
        {/* TODO pagination or translation */}
        {images.length > displayImages.length && <i>And {images.length - displayImages.length} more...</i>}
      </div>
    </AdminPageLayout>
  );
}
