import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { type ReactElement, type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Button, Form } from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { type Tab, TabBar } from '~/Components/TabBar/TabBar';
import { getEvent, getVenues } from '~/api';
import type { EventDto } from '~/dto';
import { usePrevious, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { venueKeys } from '~/queryKeys';
import { EventAgeRestriction, type EventAgeRestrictionValue, EventCategory, type EventCategoryValue } from '~/types';
import { dbT, getAgeRestrictionKey, getEventCategoryKey, lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './EventCreatorAdminPage.module.scss';
import { type FormType, useEventCreatorForm } from './hooks/useEventCreatorForm';
import { useEventMutations } from './hooks/useEventMutations';

import { type EventCreatorStep, type StepKey, steps } from './steps/stepConfig';

import type { FieldErrors } from 'react-hook-form';
import { EventPreviewCard } from './components/EventPreviewCard';
import { GraphicsStep } from './steps/GraphicsStep';
import { InfoStep } from './steps/InfoStep';
import { PaymentStep } from './steps/PaymentStep';
import { SummaryStep } from './steps/SummaryStep';
import { TextStep } from './steps/TextStep';

export function EventCreatorAdminPage() {
  const { t } = useTranslation();
  const [event, setEvent] = useState<Partial<EventDto>>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { id } = useParams();
  const { createEventMutation, editEventMutation } = useEventMutations();

  const { data: venues = [], isLoading } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getVenues,
  });

  const locationOptions: DropdownOption<string>[] = [
    ...venues.map((venue) => ({ value: venue.name, label: venue.name })),
  ];

  const eventCategoryOptions: DropdownOption<EventCategoryValue>[] = Object.values(EventCategory).map((category) => ({
    value: category,
    label: t(getEventCategoryKey(category)),
  }));

  const ageLimitOptions: DropdownOption<EventAgeRestrictionValue>[] = Object.values(EventAgeRestriction).map((age) => ({
    value: age,
    label: t(getAgeRestrictionKey(age)),
  }));

  const { form, watchedValues, buildPayload } = useEventCreatorForm({
    event,
    defaultCategory: eventCategoryOptions[0]?.value ?? EventCategory.ART,
    defaultLocation: locationOptions[0]?.value ?? '',
  });

  const stepComponentMap: Record<StepKey, ReactElement> = {
    text: <TextStep form={form} />,
    info: <InfoStep form={form} eventCategoryOptions={eventCategoryOptions} locationOptions={locationOptions} />,
    payment: <PaymentStep form={form} ageLimitOptions={ageLimitOptions} />,
    graphics: <GraphicsStep form={form} />,
    summary: <SummaryStep form={form} />,
  };

  // Fetch event data using the event ID
  useEffect(() => {
    if (id) {
      getEvent(id)
        .then((eventData) => {
          setEvent(eventData);
          setShowSpinner(false);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      setShowSpinner(false);
    }
  }, [id, t]);

  // ================================== //
  //          Creation Steps            //
  // ================================== //

  // Editor state.
  const [visitedTabs, setVisitedTabs] = useState<Record<string, boolean>>({});

  const formTabs: Tab[] = steps.map((step: EventCreatorStep) => {
    const custom = step.customIcon !== undefined;
    const valid = step.validate(watchedValues) && !custom;

    const visited = visitedTabs[step.key] === true && !custom;
    const error = !valid && visited && !custom;

    let icon = step.customIcon || 'material-symbols:circle-outline';
    if (valid) icon = 'material-symbols:check-circle';
    else if (error) icon = 'gridicons:cross-circle';

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

    return { key: step.key, label };
  });

  // ================================== //
  //             Save Logic             //
  // ================================== //

  function onSubmit(values: FormType) {
    let payload: Partial<EventDto> = buildPayload(values);

    if (id && values.image === undefined) {
      const { image, ...rest } = payload as Partial<EventDto> & { image?: unknown };
      payload = rest;
    }

    if (id) {
      editEventMutation.mutate({ id, payload });
    } else {
      createEventMutation.mutate(payload);
    }
  }

  // ================================== //
  //             Tab Logic              //
  // ================================== //

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

  // Ready to save?
  const allStepsComplete = steps.every((step) => step.validate(watchedValues));

  // ================================== //
  //          Navigation Logic          //
  // ================================== //

  // Move to next/previous tab
  function navigateTabs(delta: number): () => void {
    return () => {
      const keys = steps.map((s) => s.key);
      const idx = keys.indexOf(currentFormTab.key as StepKey) + delta;
      if (idx >= 0 && idx < steps.length) {
        setFormTab(formTabs[idx]);
      }
    };
  }

  // Render all forms (some are hidden but not removed to keep values)
  const currentStepKey = currentFormTab.key as StepKey;
  const currentStep = steps.find((step) => step.key === currentFormTab.key);
  const currentStepContent = currentStep ? (
    <>
      {currentStep.key === 'summary' && <EventPreviewCard values={watchedValues} />}
      {stepComponentMap[currentStep.key]}
    </>
  ) : null;

  const onInvalid = (errors: FieldErrors<FormType>) => {
    console.log('INVALID ERRORS', errors);
    toast.error('Form contains validation errors. Please check highlighted fields.');
    const allVisited: Record<string, boolean> = {};
    for (const s of steps) allVisited[s.key] = true;
    setVisitedTabs(allVisited);
  };
  // Navigation buttons
  const navigationButtons: ReactNode = (
    <div className={styles.button_row}>
      {currentFormTab.key !== steps[0].key ? (
        <Button theme="blue" rounded={true} onClick={navigateTabs(-1)}>
          {t(KEY.common_previous)}
        </Button>
      ) : (
        <div />
      )}
      {currentFormTab.key !== steps.slice(-1)[0].key ? (
        <Button theme="blue" rounded={true} onClick={navigateTabs(1)}>
          {t(KEY.common_next)}
        </Button>
      ) : (
        <Button theme="green" rounded={true} type="submit" disabled={!allStepsComplete}>
          {t(KEY.common_save)}
        </Button>
      )}
    </div>
  );

  const title = lowerCapitalize(`${t(id ? KEY.common_edit : KEY.common_create)} ${t(KEY.common_event)}`);
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
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
            {currentStepContent}
            {navigationButtons}
          </form>
        </Form>
      </div>
    </AdminPageLayout>
  );
}
