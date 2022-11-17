import { Dispatch, ReactNode, SetStateAction } from 'react';
/** Module for global generic types. */

/** Type for html button types. */
export type ButtonType = 'submit' | 'reset' | 'button';

/** Synonym for ReactNode, but easier to remember. */
export type Children = ReactNode;

/** Easy type when adding setStates to Context. */
export type SetState<T> = Dispatch<SetStateAction<T>>;

/**Type for label alignment. Label tag is an inline element and is positioned such
 * To the right or the left of the associated tag*/
export type Alignment = 'right' | 'left';

/**Type for input placeholders  */
export type Placeholder = string;

/***Type for input default value  */
export type DefaultValue = string;
