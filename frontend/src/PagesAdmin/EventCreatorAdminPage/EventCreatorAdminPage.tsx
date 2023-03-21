import { Button, ContentCard, Page, TimeDisplay } from '~/Components';

import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { t } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { postEvent } from '~/api';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { Tab, TabBar } from '~/Components/TabBar/TabBar';
import { EventDto } from '~/dto';
import { SamfForm, SamfFormField } from '~/Forms/GenericFormV2';
import { usePrevious } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/i18n/i18n';
import { Children } from '~/types';
import styles from './EventCreatorAdminPage.module.scss';

type EventCreatorStep = {
  key: string; // Unique key
  title_nb: string; // Tab title norwegian
  title_en: string; // Tab title english
  customIcon?: string; // Custom icon in tab bar
  template: ReactElement
};

export function EventCreatorAdminPage() {
  const { i18n } = useTranslation();
  
  // ================================== //
  //          Creation Steps            //
  // ================================== //

  const [didComplete, setDidComplete] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const categoryOptions: DropDownOption<string>[] = [
    { value: 'concert', label: 'Konsert' },
    { value: 'debate', label: 'Debatt' },
  ];

  const createSteps: EventCreatorStep[] = [
    // Name and text descriptions
    {
      key: 'text',
      title_nb: 'Tittel/beskrivelse',
      title_en: 'Text & description',
      template: (
        <>
          <div className={styles.input_row}>
            <SamfFormField field="title_nb" type="text" label="Tittel (norsk)"/>
            <SamfFormField field="title_eb" type="text" label="Tittel (engelsk)"/>
          </div>
          <div className={styles.input_row}>
            <SamfFormField field="description_short_nb" type="text-long" label="Kort beskrivelse (norsk)"/>
            <SamfFormField field="description_short_en" type="text-long" label="Kort beskrivelse (engelsk)"/>
          </div>
          <div className={styles.input_row}>
            <SamfFormField field="description_long_nb" type="text-long" label="Lang beskrivelse (norsk)"/>
            <SamfFormField field="description_long_en" type="text-long" label="Lang beskrivelse (engelsk)"/>
          </div>
        </>
      )
    },
    // General info (category, dates etc.)
    {
      key: 'info',
      title_nb: 'Dato og informasjon',
      title_en: 'Date & info',
      template: <></>
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
      template: <SamfFormField field="image" type="image" />
    },
    // Summary
    {
      key: 'summary',
      title_nb: 'Oppsummering',
      title_en: 'Summary',
      customIcon: 'ic:outline-remove-red-eye',
      template: <></>
    },
  ];

  // Editor state
  const [event, setEvent] = useState<Partial<EventDto>>();
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
        setDidComplete(true);
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
    const valid = completedSteps[step.key] === true && !custom && !didComplete;
    const visited = visitedTabs[step.key] === true && !custom && !didComplete;
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
        <span>{dbT(step, 'title', i18n.language)}</span>
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

  const eventPreview: Children = (
    <div>
      <ContentCard
        title={dbT(event, 'title', i18n.language) ?? ''}
        description={dbT(event, 'description_short', i18n.language) ?? ''}
        imageUrl={event?.image?.url}
      />
      <p>{event?.category}</p>
      <TimeDisplay timestamp={event?.start_dt ?? ''} />
      <p>{event?.duration}min</p>
    </div>
  );

  function navigateTabs(delta: number): () => void {
    return () => {
      const keys = createSteps.map((s) => s.key);
      const idx = keys.indexOf(currentFormTab.key as string) + delta;
      if (idx >= 0 && idx < createSteps.length) {
        setFormTab(formTabs[idx]);
      }
    };
  }

  const buttons: Children = (
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

  function setStepCompleted(step: EventCreatorStep, completed: boolean) {
    setCompletedSteps({
      ...completedSteps,
      [step.key]: completed
    })
  } 

  const allForms: Children = createSteps.map((step: EventCreatorStep) => {
    const hidden = currentFormTab.key !== step.key;
    const visited = visitedTabs[step.key];
    return (
      <div key={step.key} style={{ display: hidden ? 'none' : 'block' }}>
        <SamfForm onChange={setEvent} onValidityChanged={(valid) => setStepCompleted(step, valid)} validateOnInit={visited} devMode={true}>
          {step.key == 'summary' ? eventPreview : <></>}
          {step.template}
        </SamfForm>
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
          onSetTab={setTabAndVisit}
          vertical={false}
          spaceBetween={true}
          disabled={didComplete}
        />
        <div className={styles.form_container}>
          {!didComplete && (
            <>
              <div className={styles.tab_form}>{allForms}</div>
              {buttons}
            </>
          )}
          {didComplete && (
            <>
              {eventPreview}
              <div className={styles.done_row}>
                <h1>Lagret</h1>
                <Icon icon="material-symbols:check-circle" width={24} className={styles.done_icon} />
              </div>
            </>
          )}
        </div>
        {/* DEBUG */}
        {/*
          <p>completed: {JSON.stringify(completedSteps)}</p>
          <p>{JSON.stringify(event)}</p>
          */}
      </div>
    </Page>
  );
}
