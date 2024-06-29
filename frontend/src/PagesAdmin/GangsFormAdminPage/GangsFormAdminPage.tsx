import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getGang } from '~/api';
import { useCustomNavigate, useTitle } from '~/hooks';
import type { GangDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './GangsFormAdminPage.module.scss';

export function GangsFormAdminPage() {
  const navigate = useCustomNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();
  const [gang, setGang] = useState<Partial<GangDto>>({});

  //TODO add permissions on render

  // biome-ignore lint/correctness/useExhaustiveDependencies: t and navigate do not need to be in deplist
  useEffect(() => {
    if (id) {
      getGang(id)
        .then((gang) => {
          setGang(gang);
          setShowSpinner(false);
        })
        .catch((data) => {
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate({ url: ROUTES.frontend.admin_gangs });
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      setShowSpinner(false);
    }
  }, [id]);

  function handleOnSubmit(data: GangDto) {
    if (id) {
      // TODO patch
    } else {
      // TODO post
    }
    alert('TODO');
    console.log(JSON.stringify(data));
  }

  const submitText = id ? t(KEY.common_save) : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_gang)}`);
  const title = id ? t(KEY.common_edit) : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_gang)}`);
  useTitle(title);

  return (
    <AdminPageLayout title={title} loading={showSpinner} header={true} showBackButton={true}>
      <SamfForm
        initialData={gang}
        onSubmit={handleOnSubmit}
        submitText={submitText}
        validateOnInit={id !== undefined}
        devMode={false}
      >
        <div className={styles.row}>
          <SamfFormField
            field="name_nb"
            type="text"
            label={lowerCapitalize(`${t(KEY.common_norwegian)} ${t(KEY.common_name)}`)}
          />
          <SamfFormField
            field="name_en"
            type="text"
            label={lowerCapitalize(`${t(KEY.common_english)} ${t(KEY.common_name)}`)}
          />
        </div>
        <div className={styles.row}>
          <SamfFormField
            field="abbreviation"
            type="text"
            label={lowerCapitalize(`${t(KEY.admin_gangsadminpage_abbreviation)}`)}
          />
          <SamfFormField
            field="webpage"
            type="text"
            label={lowerCapitalize(`${t(KEY.admin_gangsadminpage_webpage)}`)}
          />
        </div>
        {/* TODO fetch options */}
        {/* <SamfFormField field="gang_type" type="options" label={`${t(KEY.webpage)}`} /> */}
        {/* <SamfFormField field="info_page" type="options" label={`${t(KEY.information_page)}`} /> */}
      </SamfForm>
    </AdminPageLayout>
  );
}
