import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getGang, postGang, putGang, getGangList, getInformationPages } from '~/api';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { GangDto, GangTypeDto, InformationPageDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './GangsFormAdminPage.module.scss';
import { dbT, lowerCapitalize } from '~/utils';

export function GangsFormAdminPage() {
  const navigate = useCustomNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  const [externalErrors, setExternalErrors] = useState<object>({});
  // If form has a id, check if it exists, and then load that item.
  const { id } = useParams();
  const [gang, setGang] = useState<Partial<GangDto>>({});
  const [gangTypeOptions, setGangTypeOptions] = useState<DropDownOption<number>[]>([]);
  const [infoPageOptions, setInfoPageOptions] = useState<DropDownOption<string>[]>([]);
  //TODO add permissions on render

  useEffect(() => {
    getGangList().then((data) => {
      setGangTypeOptions(
        data.map(
          (gangType: GangTypeDto) =>
            ({
              label: dbT(gangType, 'title'),
              value: gangType.id,
            }) as DropDownOption<number>,
        ),
      );
    });
    getInformationPages().then((data) => {
      setInfoPageOptions(
        data.map(
          (infoPage: InformationPageDto) =>
            ({
              label: dbT(infoPage, 'title'),
              value: infoPage.slug_field,
            }) as DropDownOption<string>,
        ),
      );
    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const initialData: Partial<GangDto> = {
    name_nb: gang?.name_nb,
    name_en: gang?.name_en,
    abbreviation: gang?.abbreviation,
    webpage: gang?.webpage,
    gang_type: gang?.gang_type,
    info_page: gang?.info_page,
    logo: gang?.logo,
  };

  function handleOnSubmit(data: GangDto) {
    setExternalErrors({});
    if (id) {
      // Update page.
      putGang(id, data)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          setExternalErrors(error.response.data);
        });
      navigate({ url: ROUTES.frontend.admin_gangs });
    } else {
      // Post new page.
      postGang(data)
        .then(() => {
          navigate({ url: ROUTES.frontend.admin_gangs });
          toast.success(t(KEY.common_creation_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          setExternalErrors(error.response.data);
        });
    }
  }

  const submitText = id ? t(KEY.common_save) : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_gang)}`);
  const title = id ? t(KEY.common_edit) : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_gang)}`);

  return (
    <AdminPageLayout title={title} loading={showSpinner}>
      <SamfForm<GangDto>
        initialData={initialData}
        onSubmit={handleOnSubmit}
        submitText={submitText}
        validateOnInit={id !== undefined}
        devMode={false}
        externalErrors={externalErrors}
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
        <div className={styles.row}>
          <SamfFormField
            field="gang_type"
            type="options"
            options={gangTypeOptions}
            label={lowerCapitalize(`${t(KEY.common_gang)} ${t(KEY.common_type)}`)}
          />
          <SamfFormField
            field="info_page"
            type="options"
            options={infoPageOptions}
            label={lowerCapitalize(`${t(KEY.information_page_short)}`)}
          />
        </div>
      </SamfForm>
    </AdminPageLayout>
  );
}
