import { Dispatch, ReactNode, SetStateAction } from 'react';
/** Module for global generic types. */

/** Type for html button types. */
export type ButtonType = 'submit' | 'reset' | 'button';

/** Synonym for ReactNode, but easier to remember. */
export type Children = ReactNode;

/** Easy type when adding setStates to Context. */
export type SetState<T> = Dispatch<SetStateAction<T>>;

/**Type for label alignment */
export type Alignment = 'top' | 'right' | 'bottom' | 'left' | 'none';

/**Type for input placeholders  */
export type Placeholder = ReactNode;

/***Type for input default value  */
export type DefaultValue = ReactNode;
