import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, FormInputField, FormSelect, FormTextAreaField, SamfundetLogoSpinner } from '~/Components';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getEvent, getEventForm } from '~/api';
import { Page } from '~/Components/Page';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { DTOToForm } from '~/utils';
import styles from './EventCreatorAdminPage.module.scss';
import { EventDto } from '~/dto';
import { Icon } from '@iconify/react';

export function EventCreatorAdminPage() {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  const event: Partial<EventDto> = {};

  function checkRow(txt: string, done: boolean): Children {
    const icon = done ? 'ic:baseline-check-circle' : 'material-symbols:circle-outline';
    return (
      <div className={styles.timeline_element}>
        <Icon icon={icon} color={done ? '#0f0' : 'red'} width={24} />
        {txt}
      </div>
    );
  }

  return (
    <Page>
      <div className={styles.timeline_container}>
        {checkRow('Tidspunkt og datoer', false)}
        {checkRow('Diverse informasjon', true)}
        {checkRow('Betaling og påmelding', false)}
        {checkRow('Utseende', false)}
      </div>
    </Page>
  );
}
