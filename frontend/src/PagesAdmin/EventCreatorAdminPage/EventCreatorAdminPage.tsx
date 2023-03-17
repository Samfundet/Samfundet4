import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  FormInputField,
  FormSelect,
  FormTextAreaField,
  InputField,
  SamfundetLogoSpinner,
  TextAreaField,
} from '~/Components';

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
import { Tab, TabBar } from '~/Components/TabBar/TabBar';
import { Children } from '~/types';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import classNames from 'classnames';
import { Input } from 'postcss';

export function EventCreatorAdminPage() {
  const navigate = useNavigate();

  // Tabs available

  function formLabel(txt: string, done: boolean, customIcon?: string): ReactElement {
    const icon = customIcon || (done ? 'material-symbols:check-circle' : 'material-symbols:circle-outline');
    return (
      <div className={styles.tab_label}>
        <Icon icon={icon} className={classNames(styles.tab_icon, done && styles.tab_icon_done)} width={24} />
        <span>{txt}</span>
      </div>
    );
  }

  function getFormTabs(): Tab[] {
    return [
      { key: 'general', label: formLabel('Navn & Beskrivelse', true) },
      { key: 'time', label: formLabel('Dato & Informasjon', false) },
      { key: 'payment', label: formLabel('Betaling / Påmelding', false) },
      { key: 'image', label: formLabel('Grafikk / Bilde', false) },
      { key: 'save', label: formLabel('Oppsummering', false, 'ic:round-short-text') },
    ];
  }

  const [currentFormTab, setFormTab] = useState<Tab>(getFormTabs()[0]);

  // Tab forms

  function wrapForm(title: string, nextTab?: Tab, form: ReactElement): ReactElement {
    return (
      <div className={styles.tab_form}>
        <div className={styles.inner_header}>{title}</div>
        {form}
      </div>
    );
  }

  function formGeneral(): Children {
    const form: ReactElement = (
      <>
        <div className={styles.input_row}>
          <InputField placeholder="Et kult arrangement" className={styles.half}>
            <label>Tittel (norsk)</label>
          </InputField>
          <InputField placeholder="A cool event" className={styles.half}>
            <label>Tittel (engelsk)</label>
          </InputField>
        </div>
        <div className={styles.input_row}>
          <InputField placeholder="Kort beskrivelse" className={styles.half}>
            <label>Kort Beskrivelse (norsk)</label>
          </InputField>
          <InputField placeholder="Short description" className={styles.half}>
            <label>Kort Beskrivelse (engelsk)</label>
          </InputField>
        </div>
        <div className={styles.input_row}>
          <TextAreaField placeholder="Et kult arrangement" className={styles.half}>
            <label>Lang Beskrivelse (norsk)</label>
          </TextAreaField>
          <TextAreaField placeholder="A cool event" className={styles.half}>
            <label>Lang Beskrivelse (engelsk)</label>
          </TextAreaField>
        </div>
      </>
    );
    return form;
  }

  function formTime(): Children {
    const form = (
      <>
        <InputField placeholder="Tidspunkt">
          <label>Dato</label>
        </InputField>
        <InputField placeholder="Tidspunkt">
          <label>Varighet (minutter)</label>
        </InputField>
        <hr />
        <InputField placeholder="Publisering">
          <label>Dato for publisering</label>
        </InputField>
      </>
    );
    return form;
  }

  function nextButton(): ReactElement {
    const tabs = getFormTabs();
    if (currentFormTab.key !== tabs[tabs.length - 1].key) {
      const idx = tabs.map((t: Tab) => t.key).indexOf(currentFormTab.key);
      return (
        <Button rounded={true} theme="green" onClick={() => setFormTab(tabs[idx + 1])}>
          Neste
          <Icon icon="mdi:arrow-right" width={18} />
        </Button>
      );
    }
    return <></>;
  }

  return (
    <Page>
      <div className={styles.header}>Opprett Arrangement</div>
      <div className={styles.outer_container}>
        <TabBar
          tabs={getFormTabs()}
          selected={currentFormTab}
          onSetTab={setFormTab}
          vertical={false}
          spaceBetween={true}
        />
        <div className={styles.form_container}>
          <div className={styles.tab_form}>
            {currentFormTab.key == 'general' && formGeneral()}
            {currentFormTab.key == 'time' && formTime()}
            <div className={styles.button_row}>{nextButton()}</div>
          </div>
        </div>
      </div>
    </Page>
  );
}
