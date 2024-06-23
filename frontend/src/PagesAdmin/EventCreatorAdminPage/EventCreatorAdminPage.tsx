import { Button, ImageCard } from '~/Components';
import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { t } from 'i18next';
import { type ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { type Tab, TabBar } from '~/Components/TabBar/TabBar';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getEvent, postEvent } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto, ImageDto } from '~/dto';
import { useCustomNavigate, usePrevious } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import type { Children, EventAgeRestrictionValue, EventTicketTypeValue } from '~/types';
import { dbT, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './EventCreatorAdminPage.module.scss';
import { PaymentForm } from './components/PaymentForm';

type EventCreatorStep = {
  key: string; // Unique key.
  title_nb: string; // Tab title norwegian.
  title_en: string; // Tab title english.
  customIcon?: string; // Custom icon in tab bar.
  template: ReactElement;
};

type FormType = {
  // text and description
  title_nb: string;
  title_en: string;
  description_long_nb: string;
  description_long_en: string;
  description_short_nb: string;
  description_short_en: string;
  // Date and information
  start_dt: string;
  duration: number;
  category: string;
  host: string;
  location: string;
  capacity: number;
  // Payment/registration
  age_restriction: EventAgeRestrictionValue;
  ticket_type: EventTicketTypeValue;
  // Graphics
  image: ImageDto;
  // Summary/Publication date
  publish_dt: string;
};
export function EventCreatorAdminPage() {
  const navigate = useCustomNavigate();
  const [event, setEvent] = useState<Partial<EventDto>>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { id } = useParams();

  // TODO these are temporary and must be fetched from API when implemented.
  const eventCategoryOptions: DropDownOption<string>[] = [
    { value: 'concert', label: 'Konsert' },
    { value: 'debate', label: 'Debatt' },
  ];
  const ageLimitOptions: DropDownOption<EventAgeRestrictionValue>[] = [
    { value: 'none', label: 'Ingen' },
    { value: 'eighteen', label: '18 år' },
    { value: 'twenty', label: '20 år' },
    { value: 'mixed', label: '18 år (student), 20 år (ikke student)' },
  ];

  //Fetch event data using the event ID
  // biome-ignore lint/correctness/useExhaustiveDependencies: navigate does not need to be in deplist
  useEffect(() => {
    if (id) {
      getEvent(id)
        .then((eventData) => {
          setEvent(eventData);
          setShowSpinner(false);
        })
        .catch((error) => {
          if (error.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate({ url: ROUTES.frontend.admin_events });
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      setShowSpinner(false);
    }
  }, [id]);

  // ================================== //
  //          Creation Steps            //
  // ================================== //

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const createSteps: EventCreatorStep[] = [
    // Name and text descriptions.
    {
      key: 'text',
      title_nb: 'Tittel/beskrivelse',
      title_en: 'Text & description',
      template: (
        <>
          <div className={styles.input_row}>
            <SamfFormField<string, FormType> field="title_nb" type="text" label="Tittel (norsk)" required={true} />
            <SamfFormField<string, FormType> field="title_en" type="text" label="Tittel (engelsk)" required={true} />
          </div>
          <div className={styles.input_row}>
            <SamfFormField<string, FormType>
              field="description_short_nb"
              type="text"
              label="Kort beskrivelse (norsk)"
              required={true}
            />
            <SamfFormField<string, FormType>
              field="description_short_en"
              type="text"
              label="Kort beskrivelse (engelsk)"
              required={true}
            />
          </div>
          <div className={styles.input_row}>
            <SamfFormField<string, FormType>
              field="description_long_nb"
              type="text_long"
              label="Lang beskrivelse (norsk)"
              required={true}
            />
            <SamfFormField<string, FormType>
              field="description_long_en"
              type="text_long"
              label="Lang beskrivelse (engelsk)"
              required={true}
            />
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
            <SamfFormField<string, FormType> field="start_dt" type="date_time" label="Dato & tid" required={true} />
            <SamfFormField<number, FormType>
              field="duration"
              type="number"
              label="Varighet (minutter)"
              required={true}
            />
          </div>
          <div className={styles.input_row}>
            <SamfFormField<string, FormType>
              field="category"
              type="options"
              label="Kategori"
              options={eventCategoryOptions}
              required={true}
            />
            <SamfFormField<string, FormType> field="host" type="text" label="Arrangør" required={true} />
            <SamfFormField<string, FormType> field="location" type="text" label="Lokale" required={true} />
            <SamfFormField<number, FormType> field="capacity" type="number" label="Kapasitet" required={true} />
          </div>
        </>
      ),
    },
    // Payment options (WIP)
    {
      key: 'payment',
      title_nb: 'Betaling/påmelding',
      title_en: 'Payment/registration',
      template: (
        <>
          <SamfFormField<string, FormType>
            field="age_restriction"
            type="options"
            label="Aldersgrense"
            options={ageLimitOptions}
            required={true}
          />
          <PaymentForm event={event ?? {}} onChange={(partial) => setEvent({ ...event, ...partial })} />
        </>
      ),
    },
    // Graphics.
    {
      key: 'graphics',
      title_nb: 'Grafikk',
      title_en: 'Graphics',
      template: <SamfFormField field="image" type="image" required={true} />,
    },
    // Summary.
    {
      key: 'summary',
      title_nb: 'Oppsummering',
      title_en: 'Summary',
      customIcon: 'ic:outline-remove-red-eye',
      template: (
        <SamfFormField
          field="publish_dt"
          type="date_time"
          label={t(KEY.saksdokumentpage_publication_date) ?? ''}
          required={true}
        />
      ),
    },
  ];

  // Editor state.
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
        navigate({ url: ROUTES.frontend.admin_events });
        toast.success(t(KEY.common_creation_successful));
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(JSON.stringify(error.response.data));
        console.error(`FAIL: ${JSON.stringify(error)}`);
      });
  }

  // ================================== //
  //             Tab Logic              //
  // ================================== //

  const formTabs: Tab[] = createSteps.map((step: EventCreatorStep) => {
    // Check step status to get icon and colors
    const custom = step.customIcon !== undefined;
    let icon = step.customIcon || 'material-symbols:circle-outline';
    const valid = completedSteps[step.key] === true && !custom;
    const visited = visitedTabs[step.key] === true && !custom;
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
    <div className={styles.preview}>
      <ImageCard
        title={dbT(event, 'title') ?? ''}
        description={dbT(event, 'description_short') ?? ''}
        imageUrl={BACKEND_DOMAIN + event?.image?.url}
        date={event?.start_dt ?? ''}
      />
      {/* Preview Info */}
      <div className={styles.previewText}>
        <span>
          <b>{t(KEY.category)}:</b> {event?.category ?? t(KEY.common_missing)}
        </span>
        <span>
          <strong>Varighet:</strong> {event?.duration ? `${event?.duration} min` : t(KEY.common_missing)}
        </span>
        <span>
          <b>{t(KEY.admin_organizer)}:</b> {event?.host ?? t(KEY.common_missing)}
        </span>
        <span>
          <b>{t(KEY.common_venue)}:</b> {event?.location ?? t(KEY.common_missing)}
        </span>
      </div>
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
          onChange={(part) => setEvent({ ...event, ...part })} // TODO: BURDE VÆRE 'ny/oppdatert' event data ?
          onValidityChanged={(valid) => {
            setStepCompleted(step, valid);
          }}
          validateOnInit={visited}
          devMode={false}
          initialData={event as FormType} //TODO: BURDE VÆRE INITIAL EVENT ?
        >
          {step.key === 'summary' ? eventPreview : <></>}
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
          <div />
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

  const title = lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_event)}`);
  return (
    <AdminPageLayout title={title} loading={showSpinner} header={true} showBackButton={true}>
      <TabBar
        tabs={formTabs}
        selected={currentFormTab}
        onSetTab={setTabAndVisit}
        vertical={false}
        spaceBetween={true}
      />
      <br />
      <div className={styles.form_container}>
        {/* Render form */}
        {allForms}
        {navigationButtons}
      </div>
    </AdminPageLayout>
  );
}
