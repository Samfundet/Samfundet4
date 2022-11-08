import { Dispatch, ReactNode, SetStateAction } from 'react';
/** Module for global generic types. */

/** Type for html button types. */
export type ButtonType = 'submit' | 'reset' | 'button';

/** Synonym for ReactNode, but easier to remember. */
export type Children = ReactNode;

/** Type for event */
export type Event = {
  id: number;
  title_no: string;
  title_en: string;
  start_dt: Date;
  end_dt: Date;
  description_long_no: string;
  description_long_en: string;
  description_short_no: string;
  description_short_en: string;
  publish_dt: Date;
  host: string;
  location: string;
};
/** Easy type when adding setStates to Context. */
export type SetState<T> = Dispatch<SetStateAction<T>>;
