import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getMenu } from '~/api';
import { MenuDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './SultenMenuFormAdminPage.module.scss';

export function SultenMenuFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form data
  const { id } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [Menu, setMenu] = useState<Partial<MenuDto>>({});
  // Fetch data if edit mode.

  useEffect(() => {
    if (id) {
      getMenu(id)
        .then((data) => {
          setMenu(data);
          setShowSpinner(false);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_recruitment);
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(data);
        });
    } else {
      setShowSpinner(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const initialData: Partial<MenuDto> = {
    name_nb: Menu?.name_nb,
    name_en: Menu?.name_en,

    description_nb: Menu?.description_nb,
    description_en: Menu?.description_en,
  };

  const submitText = id ? t(KEY.common_save) : t(KEY.common_create);

  // Loading.
  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  // function handleOnSubmit(data: MenuDto) {
  //   if (id) {
  //     // Update page.
  //     putMenu(id, data)
  //       .then(() => {
  //         toast.success(t(KEY.common_update_successful));
  //         navigate(
  //           reverse({
  //             pattern: ROUTES.frontend.admin_sulten_menu,
  //           }),
  //         );
  //       })
  //       .catch((error) => {
  //         toast.error(t(KEY.common_something_went_wrong));
  //         console.error(error);
  //       });
  //   } else {
  //     // Post new page.
  //     postMenu(data)
  //       .then(() => {
  //         navigate(
  //           reverse({
  //             pattern: ROUTES.frontend.admin_sulten_menu,
  //           }),
  //         );
  //         toast.success(t(KEY.common_creation_successful));
  //       })
  //       .catch((error) => {
  //         toast.error(t(KEY.common_something_went_wrong));
  //         console.error(error);
  //       });
  //   }
  // }

  const title = (id ? t(KEY.common_edit) : t(KEY.common_create)) + ' ' + lowerCapitalize(`${t(KEY.common_menu)}`);

  return (
    <AdminPageLayout title={title} loading={showSpinner}>
      <SamfForm<MenuDto> /*onSubmit={handleOnSubmit}*/ initialData={initialData} submitText={submitText}>
        <div className={styles.row}>
          <SamfFormField
            field="name_nb"
            required={true}
            type="text"
            label={t(KEY.common_name) + ' ' + t(KEY.common_norwegian)}
          />
          <SamfFormField
            field="name_en"
            required={true}
            type="text"
            label={t(KEY.common_name) + ' ' + t(KEY.common_english)}
          />
        </div>

        <div className={styles.row}>
          <SamfFormField
            field="description_nb"
            type="text-long"
            label={t(KEY.common_description) + ' ' + t(KEY.common_norwegian)}
          />
          <SamfFormField
            field="description_en"
            type="text-long"
            label={t(KEY.common_description) + ' ' + t(KEY.common_english)}
          />
        </div>
      </SamfForm>
    </AdminPageLayout>
  );
}
