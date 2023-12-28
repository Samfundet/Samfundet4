import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SamfundetLogoSpinner } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getTable, getVenues, postTable, putTable } from '~/api';
import { TableDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './SultenTableFormAdminPage.module.scss';

export function SultenTableFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form data
  const { id } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [lycheId, setLycheId] = useState<number>();
  const [table, setTable] = useState<Partial<TableDto>>({});

  useEffect(() => {
    // The correct venueid for lyche
    getVenues().then((data) => {
      for (const venue of data) {
        console.log(venue.name.toLowerCase());
        if (venue.name.toLowerCase() == 'lyche') {
          setLycheId(venue.id);
          break;
        }
      }
    });
  }, []);

  // Fetch data if edit mode.
  useEffect(() => {
    if (id) {
      getTable(id)
        .then((data) => {
          setTable(data);
          setShowSpinner(false);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.admin_sulten_reservations);
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(data);
        });
    } else {
      setShowSpinner(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const initialData: Partial<TableDto> = {
    name_nb: table?.name_nb,
    description_nb: table?.description_nb,
    name_en: table?.name_en,
    description_en: table?.description_nb,
    seating: table?.seating,
  };

  const submitText = (id ? t(KEY.common_save) : t(KEY.common_create)) + ' ' + t(KEY.common_table);

  // Loading.
  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  function handleOnSubmit(data: TableDto) {
    data.venue = lycheId;
    console.log(data);
    if (id) {
      // Update page.
      putTable(id, data)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
      navigate(ROUTES.frontend.admin_sulten_reservations);
    } else {
      // Post new page.
      postTable(data)
        .then(() => {
          navigate(ROUTES.frontend.admin_sulten_reservations);
          toast.success(t(KEY.common_creation_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
  }

  // TODO: Add validation for the dates
  return (
    <div className={styles.wrapper}>
      <SamfForm<TableDto> onSubmit={handleOnSubmit} initialData={initialData} submitText={submitText}>
        <div className={styles.row}>
          <SamfFormField field="name_nb" type="text" label={t(KEY.common_name) + ' ' + t(KEY.common_english)} />
          <SamfFormField field="name_en" type="text" label={t(KEY.common_name) + ' ' + t(KEY.common_norwegian)} />
        </div>

        <div className={styles.row}>
          <SamfFormField
            field="description_nb"
            type="text"
            label={t(KEY.common_description) + ' ' + t(KEY.common_english)}
          />
          <SamfFormField
            field="description_en"
            type="text"
            label={t(KEY.common_description) + ' ' + t(KEY.common_norwegian)}
          />
        </div>
        <SamfFormField field="seating" type="number" label={t(KEY.sulten_total_seats)} />
      </SamfForm>
    </div>
  );
}
