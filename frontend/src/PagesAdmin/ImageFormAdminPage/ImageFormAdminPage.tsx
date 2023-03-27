import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getImage, postImage } from '~/api';
import { Button, Page, SamfundetLogoSpinner } from '~/Components';
import { ImagePostDto } from '~/dto';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './ImageFormAdminPage.module.scss';

export function ImageFormAdminPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();

  const [showSpinner, setShowSpinner] = useState<boolean>(id !== undefined);
  const [image, setImage] = useState<Partial<ImagePostDto>>({});

  // Stuff to do on first render.
  //TODO add permissions on render

  useEffect(() => {
    if (id) {
      getImage(id)
        .then((data) => {
          setImage(data);
          setShowSpinner(false);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_images);
          }
        });
    } else {
      setShowSpinner(false);
    }
  }, [id, navigate, setImage]);

  async function handleOnSubmit(data: ImagePostDto) {
    setShowSpinner(true);
    if (id !== undefined) {
      // TODO patch
      setShowSpinner(false);
    } else {
      postImage(data)
        .then(() => {
          // Success!
          navigate(ROUTES.frontend.admin_images);
        })
        .catch((err) => {
          console.error(err);
          setShowSpinner(false);
        });
    }
  }

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  const submitText = id ? t(KEY.common_save) : `${t(KEY.common_create)} ${t(KEY.common_image)}`;
  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin_images)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <h1 className={styles.header}>
        {id ? `${t(KEY.common_edit)} ${t(KEY.common_image)}` : t(KEY.admin_images_create)}
      </h1>
      <SamfForm onSubmit={handleOnSubmit} onChange={setImage} submitText={submitText}>
        <SamfFormField field="title" type="text" label={`${t(KEY.name)}`} />
        {/* TODO helpText "Merkelapper må være separert med ', ', f.ex 'lapp1, lapp2, lapp3'" */}
        <SamfFormField field="tag_string" type="text" label={`${t(KEY.common_tags)}`} required={false} />
        {/* TODO create file picker input type */}
        <SamfFormField field="file" type="upload-image" label={`${t(KEY.common_choose)} ${t(KEY.common_image)}`} />
        <p>
          {JSON.stringify(image.file)}
          {image.file?.name}
          {}
        </p>
      </SamfForm>
    </Page>
  );
}
