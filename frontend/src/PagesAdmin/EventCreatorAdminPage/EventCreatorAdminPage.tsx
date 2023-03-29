import { Button, ContentCard, Page, TimeDisplay } from '~/Components';

import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { t } from 'i18next';
import { useState } from 'react';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { postEvent } from '~/api';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { Tab, TabBar } from '~/Components/TabBar/TabBar';
import { BACKEND_DOMAIN } from '~/constants';
import { EventDto } from '~/dto';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { usePrevious } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { Children } from '~/types';
import { dbT } from '~/utils';
import styles from './EventCreatorAdminPage.module.scss';

type EventCreatorStep = {
  key: string; // Unique key
  title_nb: string; // Tab title norwegian
  title_en: string; // Tab title english
  customIcon?: string; // Custom icon in tab bar
  template: ReactElement;
};

export function EventCreatorAdminPage() {
  const [didSave, setDidSave] = useState(false);
  const [event, setEvent] = useState<Partial<EventDto>>();

  // TODO this is temporary and must be fetched from API when categories are implemented
  const eventCategoryOptions: DropDownOption<string>[] = [
    { value: 'concert', label: 'Konsert' },
    { value: 'debate', label: 'Debatt' },
  ];

  // ================================== //
  //          Creation Steps            //
  // ================================== //

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const createSteps: EventCreatorStep[] = [
    // Name and text descriptions
    {
      key: 'text',
      title_nb: 'Tittel/beskrivelse',
      title_en: 'Text & description',
      template: (
        <>
          <div className={styles.input_row}>
            <SamfFormField field="title_nb" type="text" label="Tittel (norsk)" />
            <SamfFormField field="title_en" type="text" label="Tittel (engelsk)" />
          </div>
          <div className={styles.input_row}>
            <SamfFormField field="description_short_nb" type="text-long" label="Kort beskrivelse (norsk)" />
            <SamfFormField field="description_short_en" type="text-long" label="Kort beskrivelse (engelsk)" />
          </div>
          <div className={styles.input_row}>
            <SamfFormField field="description_long_nb" type="text-long" label="Lang beskrivelse (norsk)" />
            <SamfFormField field="description_long_en" type="text-long" label="Lang beskrivelse (engelsk)" />
          </div>
        </>
      ),
    },
    // General info (category, dates etc.)
    {
      key: 'info',
      title_nb: 'Dato og informasjon',
      title_en: 'Date & info',
      template: (
        <>
          <div className={styles.input_row}>
            <SamfFormField field="start_dt" type="datetime" label="Dato & tid" />
            <SamfFormField field="duration" type="number" label="Varighet (minutter)" />
          </div>
          <div className={styles.input_row}>
            <SamfFormField field="category" type="options" label="Kategori" options={eventCategoryOptions} />
            <SamfFormField field="host" type="text" label="Arrangør" />
            <SamfFormField field="location" type="text" label="Lokale" />
          </div>
        </>
      ),
    },
    // Payment options (not implemented yet)
    /*
    {
      key: 'payment',
      title_nb: 'Betaling/påmelding',
      title_en: 'Payment/registration',
      partial: {},
      layout: [],
    },
    */
    // Graphics
    {
      key: 'graphics',
      title_nb: 'Grafikk',
      title_en: 'Graphics',
      template: <SamfFormField field="image" type="image" />,
    },
    // Summary
    {
      key: 'summary',
      title_nb: 'Oppsummering',
      title_en: 'Summary',
      customIcon: 'ic:outline-remove-red-eye',
      template: <SamfFormField field="publish_dt" type="datetime" label="Publiseringsdato" />,
    },
  ];

  // Editor state
  const [visitedTabs, setVisitedTabs] = useState<Record<string, boolean>>({});

  // Ready to save?
  const allStepsComplete = createSteps.reduce((others, step) => {
    return others && completedSteps[step.key];
  }, true);

  // ================================== //
  //             Save Logic             //
  // ================================== //

  function trySave() {
    postEvent(event as EventDto)
      .then(() => {
        setDidSave(true);
      })
      .catch((error) => {
        console.log(JSON.stringify(error.response.data));
        console.log('FAIL: ' + JSON.stringify(error));
      });
  }

  // ================================== //
  //             Tab Logic              //
  // ================================== //

  const formTabs: Tab[] = createSteps.map((step: EventCreatorStep) => {
    // Check step status to get icon and colors
    const custom = step.customIcon !== undefined;
    let icon = step.customIcon || 'material-symbols:circle-outline';
    const valid = completedSteps[step.key] === true && !custom && !didSave;
    const visited = visitedTabs[step.key] === true && !custom && !didSave;
    const error = !valid && visited && !custom;
    if (valid) {
      icon = 'material-symbols:check-circle';
    } else if (error) {
      icon = 'gridicons:cross-circle';
    }

    // Create label
    const label = (
      <div className={styles.tab_label}>
        <Icon
          icon={icon}
          className={classNames(styles.tab_icon, valid && styles.done, error && styles.error)}
          width={24}
        />
        <span>{dbT(step, 'title')}</span>
      </div>
    );
    return { key: step.key, label: label };
  });

  const [currentFormTab, setFormTab] = useState<Tab>(formTabs[0]);
  const previousTab = usePrevious(currentFormTab);

  function setTabAndVisit(tab: Tab) {
    if (previousTab !== undefined) {
      setVisitedTabs({
        ...visitedTabs,
        [previousTab.key]: true,
      });
    }
    setFormTab(tab);
  }

  // ================================== //
  //               Forms                //
  // ================================== //

  // Event preview on final step
  const eventPreview: Children = (
    <div>
      <ContentCard
        title={dbT(event, 'title')}
        description={dbT(event, 'description_short')}
        imageUrl={BACKEND_DOMAIN + event?.image?.url}
      />
      <p>{event?.category}</p>
      <p>{event?.image?.url}</p>
      <TimeDisplay timestamp={event?.start_dt ?? ''} />
      <p>{event?.duration}min</p>
    </div>
  );

  // Move to next/previous tab
  function navigateTabs(delta: number): () => void {
    return () => {
      const keys = createSteps.map((s) => s.key);
      const idx = keys.indexOf(currentFormTab.key as string) + delta;
      if (idx >= 0 && idx < createSteps.length) {
        setFormTab(formTabs[idx]);
      }
    };
  }

  // The form is valid, set step as completed
  function setStepCompleted(step: EventCreatorStep, completed: boolean) {
    setCompletedSteps({
      ...completedSteps,
      [step.key]: completed,
    });
  }

  // Render all forms (some are hidden but not removed to keep values)
  const allForms: Children = createSteps.map((step: EventCreatorStep) => {
    const hidden = currentFormTab.key !== step.key;
    const visited = visitedTabs[step.key];
    return (
      <div key={step.key} style={{ display: hidden ? 'none' : 'block' }}>
        <SamfForm
          onChange={(part) => setEvent({ ...event, ...part })}
          onValidityChanged={(valid) => setStepCompleted(step, valid)}
          validateOnInit={visited}
          devMode={false}
        >
          {step.key == 'summary' ? eventPreview : <></>}
          {step.template}
        </SamfForm>
      </div>
    );
  });

  // Navigation buttons
  const navigationButtons: Children = (
    <>
      <div className={styles.button_row}>
        {currentFormTab.key !== createSteps[0].key ? (
          <Button theme="blue" rounded={true} onClick={navigateTabs(-1)}>
            {t(KEY.common_previous)}
          </Button>
        ) : (
          <div></div>
        )}
        {currentFormTab.key !== createSteps.slice(-1)[0].key ? (
          <Button theme="blue" rounded={true} onClick={navigateTabs(1)}>
            {t(KEY.common_next)}
          </Button>
        ) : (
          <Button theme="green" rounded={true} onClick={trySave} disabled={!allStepsComplete}>
            {t(KEY.common_save)}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <Page>
      <div className={styles.header}>Opprett Arrangement</div>
      <div className={styles.outer_container}>
        <TabBar
          tabs={formTabs}
          selected={currentFormTab}
          onSetTab={setTabAndVisit}
          vertical={false}
          spaceBetween={true}
          disabled={didSave}
        />
        <div className={styles.form_container}>
          {/* Render form */}
          {!didSave && (
            <>
              {allForms}
              {navigationButtons}
            </>
          )}
          {/* Show saved notice */}
          {didSave && (
            <>
              {eventPreview}
              <div className={styles.done_row}>
                <h1>Lagret</h1>
                <Icon icon="material-symbols:check-circle" width={24} className={styles.done_icon} />
              </div>
            </>
          )}
        </div>
      </div>
    </Page>
  );
}
