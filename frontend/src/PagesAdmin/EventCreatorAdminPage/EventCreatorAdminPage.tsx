import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { type ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import type { z } from 'zod';
import {
  Button,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  ImageCard,
  Input,
  Textarea,
} from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { ImagePicker } from '~/Components/ImagePicker/ImagePicker';
import { type Tab, TabBar } from '~/Components/TabBar/TabBar';
import { getEvent, postEvent } from '~/api';
import { BACKEND_DOMAIN } from '~/constants';
import type { EventDto } from '~/dto';
import { useCustomNavigate, usePrevious, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import {
  type Children,
  EventAgeRestriction,
  type EventAgeRestrictionValue,
  EventCategory,
  type EventCategoryValue,
  EventTicketType,
  type EventTicketTypeValue,
} from '~/types';
import { dbT, lowerCapitalize, utcTimestampToLocal } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './EventCreatorAdminPage.module.scss';
import { eventSchema } from './EventCreatorSchema';
import { CustomTicketEditor } from './components/CustomTicketEditor';

// Define the Zod schema for event validation

type FormType = z.infer<typeof eventSchema>;

type EventCreatorStep = {
  key: string; // Unique key.
  title_nb: string; // Tab title norwegian.
  title_en: string; // Tab title english.
  customIcon?: string; // Custom icon in tab bar.
  template: ReactElement;
  validate: (data: FormType) => boolean;
};

export function EventCreatorAdminPage() {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const [event, setEvent] = useState<Partial<EventDto>>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { id } = useParams();

  // TODO these are temporary and must be fetched from API when implemented.
  const eventCategoryOptions: DropdownOption<EventCategoryValue>[] = [
    { value: EventCategory.SAMFUNDET_MEETING, label: 'Samfundsmøte' },
    { value: EventCategory.CONCERT, label: 'Konsert' },
    { value: EventCategory.DEBATE, label: 'Debatt' },
    { value: EventCategory.QUIZ, label: 'Quiz' },
    { value: EventCategory.LECTURE, label: 'Foredrag' },
    { value: EventCategory.OTHER, label: 'Annet' },
  ];

  const ageLimitOptions: DropdownOption<EventAgeRestrictionValue>[] = [
    { value: EventAgeRestriction.NONE, label: 'Ingen' },
    { value: EventAgeRestriction.EIGHTEEN, label: '18 år' },
    { value: EventAgeRestriction.TWENTY, label: '20 år' },
    { value: EventAgeRestriction.MIXED, label: '18 år (student), 20 år (ikke student)' },
  ];

  const ticketTypeOptions: DropdownOption<EventTicketTypeValue>[] = [
    { value: EventTicketType.FREE, label: 'Gratis' },
    { value: EventTicketType.INCLUDED, label: 'Inkludert' },
    { value: EventTicketType.BILLIG, label: 'Billig' },
    { value: EventTicketType.REGISTRATION, label: 'Registrering' },
    { value: EventTicketType.CUSTOM, label: 'Custom' },
  ];

  // Setup React Hook Form
  const form = useForm<FormType>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title_nb: '',
      title_en: '',
      description_long_nb: '',
      description_long_en: '',
      description_short_nb: '',
      description_short_en: '',
      start_dt: '',
      duration: 0,
      category: eventCategoryOptions[0].value,
      host: '',
      location: '',
      capacity: 0,
      age_restriction: 'none',
      ticket_type: 'free',
      image: undefined,
      publish_dt: '',
    },
  });

  // Fetch event data using the event ID
  useEffect(() => {
    if (id) {
      getEvent(id)
        .then((eventData) => {
          setEvent(eventData);
          form.reset({
            title_nb: eventData.title_nb || '',
            title_en: eventData.title_en || '',
            description_long_nb: eventData.description_long_nb || '',
            description_long_en: eventData.description_long_en || '',
            description_short_nb: eventData.description_short_nb || '',
            description_short_en: eventData.description_short_en || '',
            start_dt: eventData.start_dt ? utcTimestampToLocal(eventData.start_dt, false) : '',
            duration: eventData.duration || 0,
            category: eventData.category || '',
            host: eventData.host || '',
            location: eventData.location || '',
            capacity: eventData.capacity || 0,
            age_restriction: eventData.age_restriction || 'none',
            ticket_type: eventData.ticket_type || 'free',
            image: eventData.image,
            publish_dt: eventData.publish_dt ? utcTimestampToLocal(eventData.publish_dt, false) : '',
          });
          setShowSpinner(false);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      setShowSpinner(false);
    }
  }, [id, t, form]);

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
      validate: (data) => {
        return !!(
          data.title_nb &&
          data.title_en &&
          data.description_short_nb &&
          data.description_short_en &&
          data.description_long_nb &&
          data.description_long_en
        );
      },
      template: (
        <>
          <div className={styles.input_row}>
            <FormField
              key="title_nb"
              control={form.control}
              name="title_nb"
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Tittel (norsk)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title_en"
              key={'title_en'}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Tittel (engelsk)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={styles.input_row}>
            <FormField
              control={form.control}
              name="description_short_nb"
              key={'description_short_nb'}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Kort beskrivelse (norsk)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description_short_en"
              key={'description_short_en'}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Kort beskrivelse (engelsk)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={styles.input_row}>
            <FormField
              control={form.control}
              name="description_long_nb"
              key={'description_long_nb'}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Lang beskrivelse (norsk)</FormLabel>
                  <FormControl>
                    <Textarea className="textarea" {...field} rows={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description_long_en"
              key={'description_long_en'}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Lang beskrivelse (engelsk)</FormLabel>
                  <FormControl>
                    <Textarea className="textarea" {...field} rows={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
      validate: (data) => {
        return !!(data.start_dt && data.duration && data.category && data.host && data.location && data.capacity);
      },
      template: (
        <>
          <div className={styles.input_row}>
            <FormField
              control={form.control}
              name="start_dt"
              key={'start_dt'}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Dato & tid</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              key={'duration'}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Varighet (minutter)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={styles.input_row}>
            <FormField
              control={form.control}
              name="category"
              key={'category'}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Dropdown options={eventCategoryOptions} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="host"
              key={'host'}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Arrangør</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={styles.input_row}>
            <FormField
              control={form.control}
              name="location"
              key={'location'}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Lokale</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              key={'capacity'}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Kapasitet</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      ),
    },
    // Payment options
    {
      key: 'payment',
      title_nb: 'Betaling/påmelding',
      title_en: 'Payment/registration',
      validate: (data) => {
        return !!data.age_restriction && !!data.ticket_type;
      },
      template: (
        <>
          <FormField
            control={form.control}
            name="age_restriction"
            key={'age_restriction'}
            render={({ field }) => (
              <FormItem className={styles.form_item}>
                <FormLabel>Aldersgrense</FormLabel>
                <FormControl>
                  <Dropdown options={ageLimitOptions} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ticket_type"
            key={'ticket_type'}
            render={({ field }) => (
              <FormItem className={styles.form_item}>
                <FormLabel>Billettype</FormLabel>
                <FormControl>
                  <Dropdown options={ticketTypeOptions} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            TODO: add Billig integration, registration and actuall form implemtentation of CustomTicketEditor
            <CustomTicketEditor />
          </div>
        </>
      ),
    },
    // Graphics.
    {
      key: 'graphics',
      title_nb: 'Grafikk',
      title_en: 'Graphics',
      validate: (data) => {
        return !!data.image;
      },
      template: (
        <FormField
          control={form.control}
          name="image"
          key={'image'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>Bilde</FormLabel>
              <FormControl>
                <ImagePicker
                  onSelected={(image) => {
                    field.onChange(image);
                  }}
                  selectedImage={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    // Summary.
    {
      key: 'summary',
      title_nb: 'Oppsummering',
      title_en: 'Summary',
      customIcon: 'ic:outline-remove-red-eye',
      validate: (data) => {
        return !!data.publish_dt;
      },
      template: (
        <FormField
          control={form.control}
          name="publish_dt"
          key={'publish_dt'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.saksdokumentpage_publication_date) ?? ''}</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
  ];

  // Editor state.
  const [visitedTabs, setVisitedTabs] = useState<Record<string, boolean>>({});

  // ================================== //
  //             Save Logic             //
  // ================================== //

  function onSubmit(values: FormType) {
    postEvent(values as unknown as EventDto)
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
    const stepData = form.getValues();
    const valid = step.validate(stepData) && !custom;
    const visited = visitedTabs[step.key] === true && !custom;
    const error = !valid && visited && !custom;

    // Update completed steps
    if (completedSteps[step.key] !== valid) {
      setCompletedSteps((prev) => ({
        ...prev,
        [step.key]: step.validate(stepData),
      }));
    }

    if (valid) {
      icon = 'material-symbols:check-circle';
    } else if (error) {
      icon = 'gridicons:cross-circle';
    }

    // Create label
    const label = (
      <div className={styles.tab_label} key={step.key}>
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
  //            Event Preview           //
  // ================================== //

  // Ready to save?
  const allStepsComplete = createSteps.every((step) => step.validate(form.getValues()));

  // Get current form values for preview
  const formValues = form.getValues();

  // Event preview on final step
  const eventPreview: Children = (
    <div className={styles.preview}>
      <ImageCard
        title={dbT(formValues, 'title') ?? ''}
        description={dbT(formValues, 'description_short') ?? ''}
        imageUrl={formValues.image?.url ? BACKEND_DOMAIN + formValues.image.url : ''}
        date={formValues.start_dt ?? ''}
        ticket_type={formValues.ticket_type}
        host={formValues.host}
      />
      {/* Preview Info */}
      <div className={styles.previewText}>
        <span>
          <b>{t(KEY.category)}:</b> {formValues.category ?? t(KEY.common_missing)}
        </span>
        <span>
          <strong>Varighet:</strong> {formValues.duration ? `${formValues.duration} min` : t(KEY.common_missing)}
        </span>
        <span>
          <b>{t(KEY.admin_organizer)}:</b> {formValues.host ?? t(KEY.common_missing)}
        </span>
        <span>
          <b>{t(KEY.common_venue)}:</b> {formValues.location ?? t(KEY.common_missing)}
        </span>
      </div>
    </div>
  );

  // ================================== //
  //          Navigation Logic          //
  // ================================== //

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

  // Render all forms (some are hidden but not removed to keep values)
  const currentStep = createSteps.find((step) => step.key === currentFormTab.key);
  const currentStepContent = currentStep ? (
    <>
      {currentStep.key === 'summary' && eventPreview}
      {currentStep.template}
    </>
  ) : null;

  // Navigation buttons
  const navigationButtons: Children = (
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
        <Button theme="green" rounded={true} onClick={form.handleSubmit(onSubmit)} disabled={!allStepsComplete}>
          {t(KEY.common_save)}
        </Button>
      )}
    </div>
  );

  const title = lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_event)}`);
  useTitle(title);

  return (
    <AdminPageLayout title={title} loading={showSpinner} header={true}>
      <TabBar
        tabs={formTabs}
        selected={currentFormTab}
        onSetTab={setTabAndVisit}
        vertical={false}
        spaceBetween={true}
      />
      <br />
      <div className={styles.form_container}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {currentStepContent}
            {navigationButtons}
          </form>
        </Form>
      </div>
    </AdminPageLayout>
  );
}
