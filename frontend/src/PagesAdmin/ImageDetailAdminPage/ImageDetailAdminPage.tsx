import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { ImageForm } from '~/Components';
import { getImage } from '~/api';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { imageKeys } from '~/queryKeys';
import { ROUTES } from '~/routes';
import { formatDateYMDWithTime, getFullDisplayName, imageUrl } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ImageDetailAdminPage.module.scss';

export function ImageDetailAdminPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  const {
    data: image,
    isLoading,
    error,
  } = useQuery({
    queryKey: imageKeys.detail(Number(id)),
    queryFn: () => getImage(id as string),
    enabled: id !== undefined,
  });

  useEffect(() => {
    if (error) {
      navigate({ url: ROUTES.frontend.admin_images, replace: true });
      toast.error(t(KEY.common_something_went_wrong));
    }
  }, [error, navigate, t]);

  const pageTitle = image?.title ?? t(KEY.common_image);
  useTitle(pageTitle);

  const createdAtString = image?.created_at && `, ${formatDateYMDWithTime(new Date(image.created_at))}`;
  const updatedAtString = image?.updated_at && `, ${formatDateYMDWithTime(new Date(image.updated_at))}`;

  // updated_at field always gets set, with a tiny ms delay. Formatted strings rounds this down
  const isEdited =
    image !== undefined &&
    !!image.updated_at &&
    (createdAtString !== updatedAtString || image.updated_by?.username !== image.created_by?.username);

  return (
    <AdminPageLayout
      title={pageTitle}
      header={
        image && (
          <>
            {isEdited ? (
              <>
                {t(KEY.common_last_edited_by)} {image.updated_by ? getFullDisplayName(image.updated_by) : '—'}
                {updatedAtString}
              </>
            ) : (
              <>
                {t(KEY.common_uploaded_by)} {image.created_by ? getFullDisplayName(image.created_by) : '—'}
                {createdAtString}
              </>
            )}
          </>
        )
      }
      backendUrl={ROUTES.backend.admin__samfundet_image_changelist}
      loading={isLoading}
    >
      {image && (
        <div className={styles.container}>
          <a href={imageUrl(image, 'original')} target="_blank" rel="noreferrer" className={styles.imageLink}>
            <img src={imageUrl(image, 'original')} alt={image.title} className={styles.image} />
          </a>

          <ImageForm image={image} />
        </div>
      )}
    </AdminPageLayout>
  );
}
