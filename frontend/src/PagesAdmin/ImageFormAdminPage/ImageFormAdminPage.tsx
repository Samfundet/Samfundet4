import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, SamfundetLogoSpinner, FormInputField } from '~/Components';
import { Page } from '~/Components/Page';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './ImageFormAdminPage.module.scss';
import { getImage, postImage, putImage } from '~/api';
import { STATUS } from '~/http_status_codes';
import { useForm } from 'react-hook-form';
import { DTOToForm } from '~/utils';

export function ImageFormAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm();
  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();

  // Stuff to do on first render.
  //TODO add permissions on render

  useEffect(() => {
    if (id) {
      getImage(id)
        .then((data) => {
          DTOToForm(data, setValue, []);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_images);
          }
        });
    }
    setShowSpinner(false);
  }, [id, getImage, navigate, setValue]);

  const onSubmit = (data) => {
    (id ? putImage(id, data) : postImage(data))
      .then(() => {
        navigate(ROUTES.frontend.admin_images);
      })
      .catch((e) => {
        for (const err in e.response.data) {
          setError(err, { type: 'custom', message: e.response.data[err][0] });
        }
      });
  };

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin_images)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <h1 className={styles.header}>
        {id ? `${t(KEY.common_edit)} ${t(KEY.common_image)}` : t(KEY.admin_images_create)}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.seperator}>Info</div>
        <FormInputField
          errors={errors}
          className={styles.input}
          name="title"
          required={t(KEY.form_required)}
          register={register}
        >
          <p className={styles.labelText}>{t(KEY.name)}</p>
        </FormInputField>
        <FormInputField
          errors={errors}
          className={styles.input}
          name="tags"
          helpText="Merkelapper må være separert med ', ', f.ex 'lapp1, lapp2, lapp3'"
          register={register}
        >
          <p className={styles.labelText}>{t(KEY.common_tags)}</p>
        </FormInputField>
        <div className={styles.seperator}>{t(KEY.common_image)}</div>
        <FormInputField className={styles.input} errors={errors} name="image" type="file" register={register}>
          <p className={styles.labelText}>
            {t(KEY.common_choose)} {t(KEY.common_image)}
          </p>
        </FormInputField>
        <div className={styles.submitContainer}>
          <Button theme={'success'} type="submit">
            <p className={styles.submit}>
              {id ? t(KEY.common_save) : t(KEY.common_create)} {t(KEY.gang)}
            </p>
          </Button>
        </div>
      </form>
    </Page>
  );
}
