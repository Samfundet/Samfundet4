import { Dispatch, ReactNode, SetStateAction } from 'react';
/** Module for global generic types. */

/** Type for html button types. */
export type ButtonType = 'submit' | 'reset' | 'button';

/** Synonym for ReactNode, but easier to remember. */
export type Children = ReactNode;

/** Easy type when adding setStates to Context. */
export type SetState<T> = Dispatch<SetStateAction<T>>;

/**Type for label alignment */
export type AlignLabel = 'top' | 'right' | 'bottom' | 'left';

/**Type for input placeholders  */
export type Placeholder =
  | 'Navn'
  | 'E-post'
  | 'Nummer'
  | 'Alder'
  | 'Passord'
  | 'Adresse'
  | 'DD/MM/YYY'
  | 'Medlemsnummer'
  | '19:00'
  | 'Lokale'
  | 'Arrangement';

/***Type for input default value  */
export type DefaultValue =
  | 'Navn'
  | 'E-post'
  | 'Nummer'
  | 'Alder'
  | 'Passord'
  | 'Adresse'
  | 'DD/MM/YYY'
  | 'Medlemsnummer'
  | '19:00'
  | 'Lokale'
  | 'Arrangement';
