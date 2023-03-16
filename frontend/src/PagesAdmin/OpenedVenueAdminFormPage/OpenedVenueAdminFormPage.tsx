import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getVenues, updateVenueTime } from '~/api';
import { Alert, Button, FormInputField, FormSelect, Link, SamfundetLogoSpinner } from '~/Components';
import { Checkbox } from '~/Components/Checkbox';
import { Page } from '~/Components/Page';
import { ITableCell, Table } from '~/Components/Table';
import { VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './OpenedVenueAdminFormPage.module.scss';

export function OpenedVenueAdminFormPage() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const navigate = useNavigate();
  const [alertState, setAlertState] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const [venues, setVenues] = useState<VenueDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();

  function getAllvenues() {
    setShowSpinner(true);
    getVenues()
      .then((data) => {
        setVenues(data);
        setShowSpinner(false);
      })
      .catch(console.error);
  }

  // Stuff to do on first render.
  // TODO add permissions on render

  useEffect(() => {
    getAllvenues();
  }, []);

  useEffect(() => {
    // Method for automatically get to specific venue times
    const venue = searchParams.get('venue');
    if (venue) {
      if (
        venues
          .map(function (v) {
            return v.id?.toString();
          })
          .includes(venue)
      ) {
        setValue('venue', venue);
        updateFields(venue);
      }
    }
  }, [searchParams, venues, setValue, updateFields]);

  const updateFields = (id: string) => {
    if (!isNaN(id)) {
      const venue = venues.filter((obj) => {
        return obj.id === parseInt(id);
      });
      if (venue.length > 0) {
        for (const day of days) {
          setValue('opening_' + day, venue[0]['opening_' + day].slice(0, -3));
          setValue('closing_' + day, venue[0]['closing_' + day].slice(0, -3));
          setValue('is_open_' + day, venue[0]['is_open_' + day]);
        }
      }
    }
  };

  const onSubmit = (data) => {
    updateVenueTime(data['venue'], data)
      .then(() => {
        setAlertState(true);
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
      <Alert type="success" message="Åpningstider oppdatert!" closable={alertState}></Alert>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>
          {t(KEY.edit)} {t(KEY.opening_hours)}
        </h1>
        <Link target="backend" url={ROUTES.backend.admin__samfundet_venue_changelist}>
          View in backend
        </Link>
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <FormSelect
            register={register}
            options={venues.map((element) => [element.id, element.name])}
            selectClassName={styles.select}
            className={styles.select}
            onChange={updateFields}
            required={t(KEY.form_must_choose)}
            errors={errors}
            name="venue"
          >
            <p className={styles.labelText}>{t(KEY.venue)}</p>
          </FormSelect>
          <Table
            columns={[t(KEY.common_day), t(KEY.opening), t(KEY.closing), t(KEY.open)]}
            className={styles.table}
            data={days.map(function (day) {
              return [
                { children: <p className={styles.dayName}>{t(KEY['day_' + day])}</p> } as ITableCell,
                {
                  children: (
                    <FormInputField
                      errors={errors}
                      type="time"
                      name={'opening_' + day}
                      className={styles.timeSelect}
                      register={register}
                      required={t(KEY.form_required)}
                    ></FormInputField>
                  ),
                } as ITableCell,
                {
                  children: (
                    <FormInputField
                      errors={errors}
                      type="time"
                      name={'closing_' + day}
                      className={styles.timeSelect}
                      register={register}
                      required={t(KEY.form_required)}
                    />
                  ),
                } as ITableCell,
                {
                  children: (
                    <Checkbox checkBoxClassName={styles.checkBox} register={register} name={'is_open_' + day} />
                  ),
                } as ITableCell,
              ];
            })}
          />
          <div className={styles.submitContainer}>
            <Button type="submit" theme="samf">
              {t(KEY.common_update)}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
}
