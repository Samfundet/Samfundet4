import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '~/Components/Button/Button';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import type { LinkedEventDto } from '~/api';
import { deleteImage, getImage, getImageLinkedEvents, patchImage, replaceImageFile } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import type { ImageDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../../../AdminPageLayout/AdminPageLayout';
import styles from './AdminEditImage.module.scss';

type AdminEditImageProps = {
  id?: number;
};

type FormType = {
  title: string;
  tag_string: string;
  file?: File;
};

export function AdminEditImage({ id }: AdminEditImageProps) {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const reactNavigate = useNavigate();
  const location = useLocation();
  const { id: paramsId } = useParams<{ id: string }>();

  // Use prop if provided, otherwise fall back to URL params
  const imageID = id || paramsId;

  const [image, setImage] = useState<ImageDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [linkedEvents, setLinkedEvents] = useState<LinkedEventDto[]>([]);
  const [formValues, setFormValues] = useState<FormType | null>(null);

  const title = lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.common_image)}`);
  useTitle(title);

  // Fetch the image data on mount
  useEffect(() => {
    if (!imageID) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchImage = async () => {
      try {
        setLoading(true);
        const data = await getImage(imageID);
        if (isMounted) {
          setImage(data);
          // Fetch linked events
          const events = await getImageLinkedEvents(imageID);
          if (isMounted) {
            setLinkedEvents(events);
          }
        }
      } catch (error: unknown) {
        if (!isMounted) return;

        if (error instanceof AxiosError && error.response?.status === STATUS.HTTP_404_NOT_FOUND) {
          if (isMounted) {
            setNotFound(true);
          }
        } else {
          if (isMounted) {
            setFetchError(true);
          }
          console.error('Failed to fetch image:', error instanceof AxiosError ? error.message : error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [imageID]);

  // Initialize form values when image loads
  useEffect(() => {
    if (image) {
      setFormValues({
        title: image.title,
        tag_string: image.tags.map((tag) => tag.name).join(', '),
        file: undefined,
      });
    }
  }, [image]);

  // Handle 404 redirect
  useEffect(() => {
    if (notFound) {
      navigate({ url: ROUTES.frontend.admin_images, replace: true });
    }
  }, [notFound, navigate]);

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      toast.error(t(KEY.common_something_went_wrong));
    }
  }, [fetchError, t]);

  const handleFormSubmit = async (data: FormType) => {
    if (!image) {
      toast.error(t(KEY.common_something_went_wrong));
      return;
    }

    try {
      // If a file was provided, upload it first (replaceImageFile already handles title and tags)
      if (data.file) {
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (data.file.size > MAX_FILE_SIZE) {
          toast.error('File size must be less than 5MB');
          return;
        }
        await replaceImageFile(image.id, data.file, data.title, data.tag_string);
      } else {
        // No file upload - update metadata (title and tags) only via PATCH
        const payload = {
          title: data.title,
          tag_string: data.tag_string || '',
        };
        await patchImage(image.id, payload);
      }

      // Refetch the image to get the latest version from the server
      const refreshedImage = await getImage(image.id);
      setImage(refreshedImage);

      toast.success(t(KEY.common_save_successful));

      // Navigate back to previous page after successful save
      if (location.state?.from) {
        navigate({ url: location.state.from, replace: true });
      } else {
        navigate({ url: ROUTES.frontend.admin_images, replace: true });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError ? JSON.stringify(error.response?.data) : String(error);
      toast.error(t(KEY.common_something_went_wrong));
      console.error('Failed to update image:', errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!image || linkedEvents.length > 0) {
      toast.error(t(KEY.common_cannot_delete_image));
      return;
    }

    if (!window.confirm(`${t(KEY.common_confirm_image_delete)} `)) {
      return;
    }

    try {
      setDeleting(true);
      await deleteImage(image.id);
      toast.success(t(KEY.common_delete_successful));
      navigate({ url: ROUTES.frontend.admin_images, replace: true });
    } catch (error: unknown) {
      toast.error(t(KEY.common_something_went_wrong));
      console.error('Failed to delete image:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminPageLayout title={title} loading={true} header={true}>
        <p>Loading...</p>
      </AdminPageLayout>
    );
  }

  if (notFound) {
    return null;
  }

  if (!image) {
    return null;
  }

  return (
    <AdminPageLayout title={title} loading={false} header={true}>
      <div className={styles.editContainer}>
        {/* Display current image */}
        <div className={styles.imageSection}>
          <img src={BACKEND_DOMAIN + image.url} alt={image.title} className={styles.image} />
        </div>

        {/* Edit form */}
        {formValues && (
          <div className={styles.uploadSection}>
            <h4>{lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.common_image)}`)}</h4>
            <SamfForm<FormType>
              key={`image-form-${image?.id}`}
              onSubmit={handleFormSubmit}
              submitText={t(KEY.common_save)}
              validateOn="submit"
              initialData={formValues}
            >
              <SamfFormField
                field="title"
                type="text"
                label={`${t(KEY.common_name)}`}
                required={true}
              />
              <SamfFormField
                field="tag_string"
                type="text"
                label={`${t(KEY.common_tags)}`}
                required={false}
              />
              <SamfFormField
                field="file"
                type="upload_image"
                label={lowerCapitalize(`${t(KEY.common_replace)} ${t(KEY.common_image)}`)}
                required={false}
              />
            </SamfForm>
          </div>
        )}

        {/* Linked events warning */}
        {linkedEvents.length > 0 && (
          <div className={styles.linkedEventsSection}>
            <h4>{t(KEY.common_image_linked_to_events)}:</h4>
            <ul className={styles.eventsList}>
              {linkedEvents.map((event) => {
                const eventUrl = reverse({ pattern: ROUTES.frontend.admin_events_edit, urlParams: { id: event.id } });
                return (
                  <li key={event.id} className={styles.eventItem}>
                    <a
                      href={eventUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        reactNavigate(eventUrl, { state: { from: location.pathname } });
                      }}
                    >
                      {event.title_nb || event.title_en} ({new Date(event.start_dt).toLocaleDateString()})
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className={styles.warningText}>
              {t(KEY.common_cannot_delete_image)}
            </p>
          </div>
        )}

        {/* Delete button */}
        <div className={styles.deleteSection}>
          <Button
            onClick={handleDelete}
            disabled={deleting || linkedEvents.length > 0}
            theme="samf"
            rounded={true}
            title={linkedEvents.length > 0 ? t(KEY.common_cannot_delete_image) : undefined}
          >
            {t(KEY.common_delete)}
          </Button>
        </div>
      </div>
    </AdminPageLayout>
  );
}
