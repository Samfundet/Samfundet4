import { Button, InputField, Page, TextAreaField } from '~/Components';

import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { Tab, TabBar } from '~/Components/TabBar/TabBar';
import { EventDto } from '~/dto';
import { GenericForm } from '~/Forms/GenericForm';
import { dbT } from '~/i18n/i18n';
import { Children } from '~/types';
import styles from './EventCreatorAdminPage.module.scss';

type FormPart<T> = {
  title_nb: string;
  title_en: string;
  apply(t: T): void;
};

type EventCreatorStep = {
  key: string; // Unique key
  title_nb: string; // Tab title norwegian
  title_en: string; // Tab title english
  customIcon?: string; // Custom icon in tab bar
  validate?(event: Partial<EventDto>): boolean; // Validation for this step
  layout: Array<Array<FormPart<unknown>>>;
  render(): Children; // Render function
};

export function EventCreatorAdminPage() {
  const { i18n } = useTranslation();
  const [event, setEvent] = useState<Partial<EventDto>>({});
  const [visitedTabs, setVisitedTabs] = useState<string[]>([]);

  // ================================== //
  //          Creation Steps            //
  // ================================== //

  const createSteps: EventCreatorStep[] = [
    {
      key: 'text',
      title_nb: 'Tittel/beskrivelse',
      title_en: 'Text & description',
      validate(event): boolean {
        const title_ok = event.title_nb != null && event.title_en != null;
        const dsc_short_ok = event.description_short_nb != null && event.description_short_en != null;
        const dsc_long_ok = true; //event.description_long_nb != null && event.description_long_en != null;
        return title_ok && dsc_short_ok && dsc_long_ok;
      },
      layout: [],
      render: formText,
    },
    {
      key: 'info',
      title_nb: 'Dato og informasjon',
      title_en: 'Date & info',
      validate(event): boolean {
        const start_and_duration = event.start_dt != null && event.duration != null;
        const various_info = event.category != null && event.age_group != null && event.host != null;
        return start_and_duration && various_info;
      },
      layout: [],
      render: formInfo,
    },
    {
      key: 'payment',
      title_nb: 'Betaling/påmelding',
      title_en: 'Payment/registration',
      validate: undefined,
      layout: [],
      render: formPayment,
    },
    {
      key: 'graphics',
      title_nb: 'Grafikk',
      title_en: 'Graphics',
      validate: undefined,
      layout: [],
      render: formGraphics,
    },
    {
      key: 'summary',
      title_nb: 'Oppsummering',
      title_en: 'Summary',
      validate: undefined,
      layout: [],
      render: formSummary,
    },
  ];

  // ================================== //
  //             Tab Logic              //
  // ================================== //

  const formTabs: Tab[] = createSteps.map((step: EventCreatorStep) => {
    // Check if step is done
    const done = step.validate?.(event) && true;
    const incomplete = visitedTabs.includes(step.key) && !done;

    // Generate icon
    let icon = step.customIcon || 'material-symbols:circle-outline';
    if (incomplete) {
      icon = 'gridicons:cross-circle';
    } else if (done) {
      icon = 'material-symbols:check-circle';
    }

    // Create label
    const label = (
      <div className={styles.tab_label}>
        <Icon
          icon={icon}
          className={classNames(styles.tab_icon, done && styles.done, incomplete && styles.error)}
          width={24}
        />
        <span>{dbT(step, 'title', i18n.language)}</span>
      </div>
    );
    return { key: step.key, label: label };
  });

  const [currentFormTab, setFormTab] = useState<Tab>(formTabs[0]);

  // ================================== //
  //               Forms                //
  // ================================== //

  // Utility
  function field<T>(setValue: (_: T) => void, label: string, required: boolean, area: boolean): Children {
    if (area) {
      return (
        <TextAreaField className={styles.half}>
          <label>{label}</label>
        </TextAreaField>
      );
    } else {
      return (
        <InputField<T> className={styles.half} onChange={setValue}>
          <label>{label}</label>
        </InputField>
      );
    }
  }

  function formText(): Children {
    const initial: Partial<EventDto> = {

    }
    return (
      <GenericForm<Partial<EventDto>>
        initialData={initial}
        layout={[[]]}
        validateOn='submit'
        onChange={(v) => {}}
      />
    )
    /*const form: ReactElement = (
      <>
        <div className={styles.input_row}>
          {field<string>(
            (value) => {
              setEvent({
                ...event,
                title_nb: value,
              });
            },
            'Tittel (norsk)',
            true,
            false,
          )}
          {field<string>(
            (value) => {
              setEvent({
                ...event,
                title_en: value,
              });
            },
            'Tittel (engelsk)',
            true,
            false,
          )}
        </div>
        <div className={styles.input_row}>
          {field<string>(
            (value) => {
              setEvent({
                ...event,
                description_short_nb: value,
              });
            },
            'Kort beskrivelse (norsk)',
            true,
            false,
          )}
          {field<string>(
            (value) => {
              setEvent({
                ...event,
                description_short_en: value,
              });
            },
            'Kort beskrivelse (engelsk)',
            true,
            false,
          )}
        </div>
      </>
    );
    return form;
    */
  }

  function formInfo(): Children {
    const form = <b>test</b>;
    return form;
  }

  function formPayment(): Children {
    return <span>TODO</span>;
  }

  function formGraphics(): Children {
    return <span>TODO</span>;
  }

  function formSummary(): Children {
    return <span>TODO</span>;
  }

  // Form validation

  function jumpButton(txt: string, delta: number): ReactElement {
    const idx = formTabs.map((t: Tab) => t.key).indexOf(currentFormTab.key);
    const target = idx + delta;
    if (target < formTabs.length && target >= 0) {
      return (
        <Button rounded={true} theme="blue" onClick={() => setFormTab(formTabs[idx + delta])}>
          {delta < 0 && <Icon icon="mdi:arrow-left" width={18} />}
          {txt}
          {delta > 0 && <Icon icon="mdi:arrow-right" width={18} />}
        </Button>
      );
    }
    return <div></div>;
  }

  const allForms: Children = createSteps.map((step: EventCreatorStep) => {
    const hidden = currentFormTab.key !== step.key;
    return (
      <div key={step.key} style={{ display: hidden ? 'none' : 'block' }}>
        {step.render()}
      </div>
    );
  });

  return (
    <Page>
      <div className={styles.header}>Opprett Arrangement</div>
      <div className={styles.outer_container}>
        <TabBar
          tabs={formTabs}
          selected={currentFormTab}
          onSetTab={(tab) => {
            setVisitedTabs([currentFormTab.key as string, ...visitedTabs]);
            setFormTab(tab);
          }}
          vertical={false}
          spaceBetween={true}
        />
        <div className={styles.form_container}>
          <div className={styles.tab_form}>{allForms}</div>
        </div>
        <p>{JSON.stringify(event)}</p>
      </div>
    </Page>
  );
}
