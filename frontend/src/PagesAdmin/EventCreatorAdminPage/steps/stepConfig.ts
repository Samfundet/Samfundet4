import type { FormType } from '../hooks/useEventCreatorForm';

export type StepKey = 'text' | 'info' | 'payment' | 'graphics' | 'summary';

export type EventCreatorStep = {
  key: StepKey;
  title_nb: string;
  title_en: string;
  customIcon?: string;
  validate: (data: FormType) => boolean;
};

export const steps: EventCreatorStep[] = [
  {
    key: 'text',
    title_nb: 'Tittel/beskrivelse',
    title_en: 'Text & description',
    validate: (d) =>
      !!(
        d.title_nb &&
        d.title_en &&
        d.description_short_nb &&
        d.description_short_en &&
        d.description_long_nb &&
        d.description_long_en
      ),
  },
  {
    key: 'info',
    title_nb: 'Dato og informasjon',
    title_en: 'Date & info',
    validate: (d) => !!(d.start_dt && d.duration > 0 && d.category && d.host && d.location),
  },
  {
    key: 'payment',
    title_nb: 'Betaling/påmelding',
    title_en: 'Payment/registration',
    validate: (d) => !!d.age_restriction && !!d.ticket_type,
  },
  {
    key: 'graphics',
    title_nb: 'Grafikk',
    title_en: 'Graphics',
    validate: (d) => !!d.image,
  },
  {
    key: 'summary',
    title_nb: 'Oppsummering',
    title_en: 'Summary',
    customIcon: 'ic:outline-remove-red-eye',
    validate: (d) => !!d.visibility_from_dt,
  },
];
