import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ImageQuery } from '~/Components';
import { PagedPagination } from '~/Components/Pagination';
import { getImages } from '~/api';
import type { ImageDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ImageAdminPage.module.scss';
import { AdminImage } from './components';

const PAGE_SIZE = 20;

export function ImageAdminPage() {
  const [images, setImages] = useState<ImageDto[]>([]);
  const [allImages, setAllImages] = useState<ImageDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = useTranslation();
  useTitle(t(KEY.admin_images_title));

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

  // Reset to page 1 when filtered images change
  useEffect(() => {
    setCurrentPage(1);
  }, [images]);

  const title = t(KEY.admin_images_title);
  const backendUrl = ROUTES.backend.admin__samfundet_image_changelist;
  const header = (
    <Button theme="success" rounded={true} link={ROUTES.frontend.admin_images_create}>
      {lowerCapitalize(t(KEY.admin_images_create))}
    </Button>
  );

  // Calculate paginated images
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const displayImages = images.slice(startIndex, endIndex);

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <div className={styles.action_row}>
        <ImageQuery allImages={allImages} setImages={setImages} />
      </div>
      <div className={styles.imageContainer}>
        {displayImages.map((element) => (
          <AdminImage key={element.id} image={element} className={styles.imageBox} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <PagedPagination
          currentPage={currentPage}
          totalItems={images.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminPageLayout>
  );
}
