import { Icon } from '@iconify/react';
import { Link } from '~/Components/Link/Link';
import { SultenPage } from '~/Components/SultenPage';
import { TextItem } from '~/constants/TextItems';
import { useTextItem } from '~/hooks';
import { ROUTES } from '~/routes';
import styles from './LycheReservationPage.module.scss';
import { ReservationDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';

export function LycheReservationPage() {
  const { t } = useTranslation();
  const [reservation, setReservation] = useState<ReservationDto>();
  const [step, setStep] = useState(0);

  const occasionOptions: DropDownOption<T>[] = [
    { value: 'DRINK', label: 'drikke' },
    { value: 'EAT', label: 'spise' },
  ];

  const hourseOptions: DropDownOption<T>[] = [
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },

  ];

  const occupancyOptions: DropDownOption<T>[] = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },

  ];
  return (
    <>
      <SultenPage>
        <SamfForm>
          <SamfFormField label="Anledning" type="options" options={occasionOptions} field="occasion" required={true} />
          <SamfFormField label="Antall personer" type="options" options={occupancyOptions} field="guest_count" required={true} />
          <SamfFormField label="Dato" type="date" options={occupancyOptions} field="date" required={true} />
          </SamfForm>
      </SultenPage>
    </>
  );
}
