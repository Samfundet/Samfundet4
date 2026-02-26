import { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '~/Components/Button/Button';
import { getImage, replaceImageFile } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import type { ImageDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../../../AdminPageLayout/AdminPageLayout';
import styles from './AdminEditImage.module.scss';

type AdminEditImageProps = {
  id?: number;
};

export function AdminEditImage({ id }: AdminEditImageProps) {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const { id: paramsId } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use prop if provided, otherwise fall back to URL params
  const imageID = id || paramsId;

  const [image, setImage] = useState<ImageDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<boolean>(false);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !image) {
      toast.error(t(KEY.common_something_went_wrong));
      return;
    }

    // Validate file size (5MB max)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      await replaceImageFile(image.id, selectedFile, image.title);

      // Refetch the image to get the latest version from the server
      const refreshedImage = await getImage(image.id);
      setImage(refreshedImage);

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success(t(KEY.common_creation_successful));
    } catch (error: unknown) {
      toast.error(t(KEY.common_something_went_wrong));
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
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
          <div className={styles.imageInfo}>
            <h3>{image.title}</h3>
            <p className={styles.tags}>{image.tags.map((tag) => tag.name).join(', ')}</p>
          </div>
        </div>

        {/* Upload form */}
        <div className={styles.uploadSection}>
          <h4>{lowerCapitalize(`${t(KEY.common_replace)} ${t(KEY.common_image)}`)}</h4>
          <div className={styles.uploadForm}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className={styles.fileInput}
            />
            {selectedFile && <p className={styles.fileName}>{selectedFile.name}</p>}
            <Button onClick={handleUpload} disabled={!selectedFile || uploading} theme="success" rounded={true}>
              {uploading ? t(KEY.common_loading) : t(KEY.common_upload)}
            </Button>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
