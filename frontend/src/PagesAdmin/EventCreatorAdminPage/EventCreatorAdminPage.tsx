import { Button, ContentCard, Page, TimeDisplay } from '~/Components';

import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { postEvent } from '~/api';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { Tab, TabBar } from '~/Components/TabBar/TabBar';
import { EventDto } from '~/dto';
import { FormField, GenericForm, OptionsFormField } from '~/Forms/GenericForm';
import { usePrevious } from '~/hooks';
import { dbT } from '~/i18n/i18n';
import { Children } from '~/types';
import styles from './EventCreatorAdminPage.module.scss';

type EventCreatorStep = {
  key: string; // Unique key
  title_nb: string; // Tab title norwegian
  title_en: string; // Tab title english
  partial: Partial<EventDto>;
  customIcon?: string; // Custom icon in tab bar
  layout: FormField<unknown>[][];
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
      partial: {
        title_nb: 'undefined',
        title_en: 'undefined',
        description_short_nb: 'undefined',
        description_short_en: 'undefined',
        description_long_nb: 'undefined',
        description_long_en: 'undefined',
      },
      layout: [
        [
          { key: 'title_nb', label: 'Tittel (norsk)', type: 'text' },
          { key: 'title_en', label: 'Tittel (engelsk)', type: 'text' },
        ],
        [
          { key: 'description_short_nb', label: 'Kort beskrivelse (norsk)', type: 'text-long' },
          { key: 'description_short_en', label: 'Kort beskrivelse (engelsk)', type: 'text-long' },
        ],
        [
          { key: 'description_long_nb', label: 'Lang beskrivelse (norsk)', type: 'text-long' },
          { key: 'description_long_en', label: 'Lang beskrivelse (engelsk)', type: 'text-long' },
        ],
      ],
    },
    // General info (category, dates etc.)
    {
      key: 'info',
      title_nb: 'Dato og informasjon',
      title_en: 'Date & info',
      partial: {
        start_dt: undefined,
        duration: 60,
        category: 'concert',
        host: 'undefined',
        location: 'undefined',
        publish_dt: undefined,
      },
      layout: [
        [
          { key: 'start_dt', label: 'Dato og tidspunkt', type: 'datetime' },
          { key: 'duration', label: 'Varighet (minutter)', type: 'number' },
        ],
        [
          { key: 'host', label: 'Arrangør', type: 'text' },
          { key: 'location', label: 'Sted/lokale', type: 'text' },
        ],
        [{ key: 'category', label: 'Kategori', type: 'options', options: categoryOptions } as OptionsFormField<string>],
        [{ key: 'publish_dt', label: 'Publiseringsdato', type: 'datetime' }],
      ],
    },
    // Payment options
    {
      key: 'payment',
      title_nb: 'Betaling/påmelding',
      title_en: 'Payment/registration',
      partial: {},
      layout: [],
    },
    // Graphics
    {
      key: 'graphics',
      title_nb: 'Grafikk',
      title_en: 'Graphics',
      partial: {
        image: undefined,
      },
      layout: [[{ key: 'image', label: 'Bilde', type: 'image' }]],
    },
    // Summary
    {
      key: 'summary',
      title_nb: 'Oppsummering',
      title_en: 'Summary',
      partial: {},
      layout: [],
      customIcon: 'ic:outline-remove-red-eye',
    },
  ];

  // Editor state
  let initialEvent: Partial<EventDto> = {};
  createSteps.forEach((step) => (initialEvent = { ...initialEvent, ...step.partial }));
  const [event, setEvent] = useState<Partial<EventDto>>();
  const [visitedTabs, setVisitedTabs] = useState<Record<string, boolean>>({});

  // ================================== //
  //             Save Logic             //
  // ================================== //

  function trySave() {
    alert(JSON.stringify(event));
    postEvent(event as EventDto)
      .then((response) => {
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
        buttonText={null}
      />
      <p>{event?.category}</p>
      <TimeDisplay timestamp={event?.start_dt ?? ''} />
      <p>{event?.duration}min</p>
    </div>
  );

  function renderForm(step: EventCreatorStep): Children {
    const form = (
      <GenericForm<Partial<EventDto>>
        key={step.key}
        initialData={step.partial}
        layout={step.layout}
        validateOn="change"
        validateOnInit={visitedTabs[step.key] === true}
        onChange={(part) => setEvent({ ...event, ...part })}
        onValid={(valid) => {
          setCompletedSteps({
            ...completedSteps,
            [step.key]: valid,
          });
        }}
        showSubmitButton={false}
      />
    );
    return (
      <div>
        {step.key == 'summary' && eventPreview}
        {form}
      </div>
    );
  }

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
            Forrige
          </Button>
        ) : (
          <div></div>
        )}
        {currentFormTab.key !== createSteps.slice(-1)[0].key ? (
          <Button theme="blue" rounded={true} onClick={navigateTabs(1)}>
            Neste
          </Button>
        ) : (
          <Button theme="green" rounded={true} onClick={trySave}>
            Lagre
          </Button>
        )}
      </div>
    </>
  );

  const allForms: Children = createSteps.map((step: EventCreatorStep) => {
    const hidden = currentFormTab.key !== step.key;
    return (
      <div key={step.key} style={{ display: hidden ? 'none' : 'block' }}>
        {renderForm(step)}
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
          {didComplete &&
            <>
              {eventPreview}
              <div className={styles.done_row}>
                <h1>Lagret</h1>
                <Icon icon="material-symbols:check-circle" width={24} className={styles.done_icon}/>
              </div>
            </> 
          }
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
