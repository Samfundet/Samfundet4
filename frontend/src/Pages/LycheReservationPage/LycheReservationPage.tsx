import { Link } from '~/Components/Link/Link';
import { SultenPage } from '~/Components/SultenPage';
import { TextItem } from '~/constants/TextItems';
import styles from './LycheReservationPage.module.scss';
import { toast } from 'react-toastify';
import { KV } from '~/constants';
import { useKeyValue, useTextItem } from '~/hooks';
import { FetchAvailableTimesDto, ReservationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { ReservationFormLine } from './Components';
import { getAvailableTimes, getReservationForm } from '~/api';
import { dbT } from '~/utils';
import { STATUS } from '~/http_status_codes';

export function LycheReservationPage() {
  const { t } = useTranslation();
  const sultenMail = useKeyValue(KV.SULTEN_MAIL);
  const [reservation, setReservation] = useState<ReservationDto>();
  const [hoursOptions, setHoursOptions] = useState<DropDownOption<string>[]>();
  const [occasionOptions, setOccasionOptions] = useState<DropDownOption<string>[]>();
  const [occupancyOptions, setOccupancyOptions] = useState<DropDownOption<number>[]>();
  const [availableDate, setAvailableDate] = useState<boolean>(false);

  useEffect(() => {
    getReservationForm()
      .then((data) => {
        setOccasionOptions(data.occasion.map((d: string[]) => ({ value: d[0], label: d[1] })));
        if (data.biggest_table == 0) {
          toast.error('Det eksisterer ingen bord i backend');
        } else {
          setOccupancyOptions(
            new Array(data.biggest_table).fill(null).map((_, i) => ({ value: i + 1, label: (i + 1).toString() })),
          );
        }
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function checkAvailableDate(data: ReservationDto) {
    getAvailableTimes(data as FetchAvailableTimesDto)
      .then((dateData: string[]) => {
        const transformed_hours = dateData.map((d: string) => ({ value: d, label: d }));
        setHoursOptions(transformed_hours);
        if (transformed_hours.length > 0) {
          setReservation(data);
          setAvailableDate(true);
        } else {
          toast.error(t(KEY.sulten_no_available_tables));
        }
      })
      .catch((e) => {
        if (e.response.status == STATUS.HTTP_406_NOT_ACCEPTABLE) {
          toast.error(dbT(e.response.data, 'error'));
        } else {
          toast.error(t(KEY.common_something_went_wrong));
        }
        setAvailableDate(false);
      });
  }

  function submit(data: ReservationDto) {
    console.log({ ...reservation, data });
  }

  const findAvailableDateStage = (
    <SamfForm
      className={styles.formContainer}
      onSubmit={checkAvailableDate}
      submitButtonTheme="lyche"
      submitButtonDisplay="block"
      submitText={t(KEY.sulten_reservation_form_find_times)}
    >
      <ReservationFormLine
        label={t(KEY.common_occasion)}
        help_text={t(KEY.sulten_reservation_form_occasion_help) + '*'}
        underline={true}
      >
        <SamfFormField type="options" options={occasionOptions} field="occasion" required={true} />
      </ReservationFormLine>
      <ReservationFormLine
        label={t(KEY.common_total) + ' ' + t(KEY.common_guests) + '*'}
        help_text={t(KEY.sulten_reservation_form_more_than_8_help)}
        underline={true}
      >
        <SamfFormField type="options" options={occupancyOptions} field="guest_count" required={true} />
      </ReservationFormLine>
      <ReservationFormLine label={t(KEY.common_date) + '*'} underline={true}>
        <SamfFormField type="date" options={occupancyOptions} field="reservation_date" required={true} />
      </ReservationFormLine>
    </SamfForm>
  );

  const reserveStage = (
    <SamfForm
      className={styles.formContainer}
      onSubmit={submit}
      submitButtonTheme="lyche"
      submitButtonDisplay="block"
      submitText={t(KEY.sulten_reservation_form_find_times)}
    >
      <div className={styles.reservation_info}>
        <p className={styles.text}>
          {t(KEY.common_date)} {reservation?.reservation_date as string}
        </p>
        <p className={styles.text}>
          {t(KEY.common_guests)}: {reservation?.guest_count}
        </p>
      </div>
      <ReservationFormLine label={t(KEY.common_time) + '*'}>
        <SamfFormField type="options" options={hoursOptions} field="start_time" required={true} />
      </ReservationFormLine>
      <ReservationFormLine label={t(KEY.common_name) + '*'}>
        <SamfFormField type="text" field="name" required={true} />
      </ReservationFormLine>
      <ReservationFormLine label={t(KEY.common_phonenumber) + '*'}>
        <SamfFormField type="text" field="phonenumber" required={true} />
      </ReservationFormLine>
      <ReservationFormLine label={t(KEY.common_email) + '*'} underline={true}>
        <SamfFormField type="email" field="email" required={true} />
      </ReservationFormLine>
      <ReservationFormLine label={t(KEY.common_message)}>
        <SamfFormField type="text" field="additional_info" required={false} />
      </ReservationFormLine>
      <SamfFormField type="checkbox" field="agree" label="piracy policy agree" required={true} />
    </SamfForm>
  );

  return (
    <SultenPage>
      <div className={styles.container}>
        <div className={styles.partContainer}>
          <h1 className={styles.header}>{t(KEY.common_reservation)}</h1>
          <p className={styles.text}>{useTextItem(TextItem.sulten_reservation_help)}</p>
          <p className={styles.text}>
            {useTextItem(TextItem.sulten_reservation_contact)}{' '}
            <Link target="email" className={styles.email} url={`mailto:${sultenMail}`}>
              {sultenMail}
            </Link>
          </p>
        </div>
        {availableDate ? reserveStage : findAvailableDateStage}
      </div>
    </SultenPage>
  );
}
