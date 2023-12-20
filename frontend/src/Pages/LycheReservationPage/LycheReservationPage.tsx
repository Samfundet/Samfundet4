import { Link } from '~/Components/Link/Link';
import { SultenPage } from '~/Components/SultenPage';
import { TextItem } from '~/constants/TextItems';
import { useTextItem } from '~/hooks';
import styles from './LycheReservationPage.module.scss';
import { ReservationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { ReservationFormLine } from './Components';

export function LycheReservationPage() {
  const { t } = useTranslation();
  const [reservation, setReservation] = useState<ReservationDto>();
  const [step, setStep] = useState(0);

  const occasionOptions: DropDownOption<string>[] = [
    { value: 'DRINK', label: 'drikke' },
    { value: 'EAT', label: 'spise' },
  ];

  const hoursOptions: DropDownOption<string>[] = [
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
  ];

  const occupancyOptions: DropDownOption<number>[] = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
  ];

  function goToStageTwo(data: ReservationDto) {
    setReservation({ ...reservation, data } as ReservationDto);
    setStep(1);
  }

  function submit(data: ReservationDto) {
    console.log({ ...reservation, data });
  }

  return (
    <>
      <SultenPage>
        <div className={styles.container}>
          <div className={styles.partContainer}>
            <h1 className={styles.header}>{t(KEY.common_reservation)}</h1>
            <p className={styles.text}>{useTextItem(TextItem.sulten_reservation_help)}</p>
            <p className={styles.text}>
              {useTextItem(TextItem.sulten_reservation_contact)}{' '}
              <Link target="email" className={styles.email} url="lyche@samfundet.no">
                lyche@samfundet.no
              </Link>
            </p>
          </div>
          {step === 0 ? (
            <SamfForm
              className={styles.formContainer}
              onSubmit={goToStageTwo}
              submitTheme="lyche"
              submitDisplay="block"
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
          ) : (
            <SamfForm
              className={styles.formContainer}
              onSubmit={submit}
              submitTheme="lyche"
              submitDisplay="block"
              submitText={t(KEY.sulten_reservation_form_find_times)}
            >
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
          )}
        </div>
      </SultenPage>
    </>
  );
}
