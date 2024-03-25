import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getImage, postImage } from '~/api';
import { ImagePostDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ImageFormAdminPage.module.scss';

export function ImageFormAdminPage() {
  const navigate = useCustomNavigate();
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
        .catch((error) => {
          if (error.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate({ url: ROUTES.frontend.admin_images });
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    } else {
      setShowSpinner(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setImage]);

  async function handleOnSubmit(data: ImagePostDto) {
    setShowSpinner(true);
    if (id !== undefined) {
      // TODO patch
      setShowSpinner(false);
    } else {
      postImage(data)
        .then(() => {
          // Success!
          navigate({ url: ROUTES.frontend.admin_images });
          toast.success(t(KEY.common_creation_successful));
        })
        .catch((err) => {
          setShowSpinner(false);
          toast.error(t(KEY.common_something_went_wrong));
          console.error(err);
        });
    }
  }

  const submitText = id ? t(KEY.common_save) : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_image)}`);
  const title = id ? lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.common_image)}`) : t(KEY.admin_images_create);

  return (
    <AdminPageLayout title={title} loading={showSpinner}>
      <SamfForm onSubmit={handleOnSubmit} onChange={setImage} submitText={submitText} validateOn="submit">
        <div className={styles.input_row}>
          <SamfFormField field="title" type="text" label={`${t(KEY.common_name)}`} />
          {/* TODO helpText "Merkelapper må være separert med ', ', f.ex 'lapp1, lapp2, lapp3'" */}
          <SamfFormField field="tag_string" type="text" label={`${t(KEY.common_tags)}`} required={false} />
          {/* TODO create file picker input type */}
        </div>
        <SamfFormField
          field="file"
          type="upload-image"
          label={lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.common_image)}`)}
        />
        <p>
          {JSON.stringify(image.file)}
          {image.file?.name}
        </p>
      </SamfForm>
    </AdminPageLayout>
  );
}
