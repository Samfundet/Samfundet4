import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { ImageForm, LastUpdatedByHeader, TagChip } from '~/Components';
import { getImage } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import { imageKeys } from '~/domain';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { hasPermissions, imageUrl } from '~/utils';
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

  const pageTitle = image ? `${t(KEY.common_edit)}: ${image?.title}` : t(KEY.common_image);
  useTitle(pageTitle);

  const { user } = useAuthContext();

  const canChange = hasPermissions(user, [PERM.SAMFUNDET_CHANGE_IMAGE], undefined, true);

  return (
    <AdminPageLayout
      title={pageTitle}
      header={<LastUpdatedByHeader model={image} />}
      backendUrl={ROUTES.backend.admin__samfundet_image_changelist}
      loading={isLoading}
    >
      {image && (
        <div className={styles.container}>
          <a href={imageUrl(image, 'original')} target="_blank" rel="noreferrer" className={styles.imageLink}>
            <img src={imageUrl(image, 'original')} alt={image.title} className={styles.image} />
          </a>

          {!canChange && (
            <div>
              <label>{t(KEY.common_tags)}</label>
              <div className={styles.tag_chips}>
                {image.tags.map((t) => (
                  <TagChip tag={t} key={t.name} />
                ))}
              </div>
            </div>
          )}

          <ImageForm image={image} />
        </div>
      )}
    </AdminPageLayout>
  );
}
