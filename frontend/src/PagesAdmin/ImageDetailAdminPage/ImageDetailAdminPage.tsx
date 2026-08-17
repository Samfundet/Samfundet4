import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { ImageForm, LastUpdatedByHeader, Link, TagChip } from '~/Components';
import type { ImageReferenceDto } from '~/dto';
import { getImage } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import { imageKeys } from '~/domain';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { hasPermissions, imageUrl } from '~/utils';
import type { LinkTarget } from '~/Components/Link/Link';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ImageDetailAdminPage.module.scss';

function imageReferenceToLink(reference: ImageReferenceDto): { label: string; url: string; target: LinkTarget } {
  if (reference.model === 'event') {
    return {
      label: `Event: ${reference.label}`,
      url: reverse({
        pattern: ROUTES.frontend.admin_events_edit,
        urlParams: { id: reference.id },
      }),
      target: 'frontend',
    };
  }

  if (reference.model === 'gang_section') {
    return {
      label: `Gang section: ${reference.label}`,
      url: reference.admin_url ?? `/admin/samfundet/gangsection/${reference.id}/change/`,
      target: 'backend',
    };
  }

  if (reference.model === 'blog_post') {
    return {
      label: `Blog post: ${reference.label}`,
      url: reference.admin_url ?? `/admin/samfundet/blogpost/${reference.id}/change/`,
      target: 'backend',
    };
  }

  if (reference.model === 'infobox') {
    return {
      label: `Infobox: ${reference.label}`,
      url: reference.admin_url ?? `/admin/samfundet/infobox/${reference.id}/change/`,
      target: 'backend',
    };
  }

  return {
    label: `Merch: ${reference.label}`,
    url: reference.admin_url ?? `/admin/samfundet/merch/${reference.id}/change/`,
    target: 'backend',
  };
}

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

  const pageTitle = image ? `${t(KEY.common_edit)}: ${image?.title}` : t(KEY.admin_images_create);
  useTitle(pageTitle);

  const { user } = useAuthContext();

  const canChange = useMemo(() => {
    return hasPermissions(user, [PERM.SAMFUNDET_CHANGE_IMAGE], image?.id, true);
  }, [user, image]);

  const references = image?.references ?? [];

  return (
    <AdminPageLayout
      title={pageTitle}
      header={<LastUpdatedByHeader model={image} />}
      backendUrl={
        image
          ? reverse({ pattern: ROUTES.backend.adminsamfundetimage__objectId, urlParams: { objectId: image.id } })
          : ROUTES.backend.admin__samfundet_image_changelist
      }
      loading={isLoading}
    >
      <div className={styles.container}>
        {image && (
          <a href={imageUrl(image, 'original')} target="_blank" rel="noreferrer" className={styles.imageLink}>
            <img src={imageUrl(image, 'original')} alt={image.title} className={styles.image} />
          </a>
        )}

        {image && (
          <section className={styles.referencesSection}>
            <label>Used by ({references.length})</label>
            {references.length === 0 ? (
              <p className={styles.emptyReferences}>No database references found.</p>
            ) : (
              <ul className={styles.referenceList}>
                {references.map((reference) => {
                  const { label, url, target } = imageReferenceToLink(reference);
                  return (
                    <li key={`${reference.model}-${reference.id}`}>
                      <Link url={url} target={target}>
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {image && !canChange && (
          <div>
            <label>{t(KEY.common_tags)}</label>
            <div className={styles.tag_chips}>
              {image.tags.map((t) => (
                <TagChip tag={t} key={t.name} />
              ))}
            </div>
          </div>
        )}

        <ImageForm
          image={image}
          onCreated={(image) =>
            navigate({
              url: reverse({
                pattern: ROUTES_FRONTEND.admin_images_detail,
                urlParams: { id: image.id },
              }),
            })
          }
        />
      </div>
    </AdminPageLayout>
  );
}
