import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getImage } from '~/api';
import { Button, Page, SamfundetLogoSpinner } from '~/Components';
import { ImageDto } from '~/dto';
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
  const [image, setImage] = useState<Partial<ImageDto>>({});

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

  function handleOnSubmit(data: ImageDto) {
    if (id !== undefined) {
      // TODO patch
    } else {
      // TODO post
    }
    alert('TODO');
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
      <SamfForm onSubmit={handleOnSubmit} submitText={submitText}>
        <SamfFormField field="title" type="text" label={`${t(KEY.name)}`} />
        {/* TODO helpText "Merkelapper må være separert med ', ', f.ex 'lapp1, lapp2, lapp3'" */}
        <SamfFormField field="tags" type="text" label={`${t(KEY.common_tags)}`} />
        {/* TODO create file picker input type */}
        <SamfFormField field="image" type="text" label={`${t(KEY.common_choose)} ${t(KEY.common_image)}`} />
      </SamfForm>
    </Page>
  );
}
