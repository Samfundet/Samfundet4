import { Dispatch, ReactNode, SetStateAction } from 'react';
/** Module for global generic types. */

/** Type for html button types. */
export type ButtonType = 'submit' | 'reset' | 'button';

/** Synonym for ReactNode, but easier to remember. */
export type Children = ReactNode;

/** Easy type when adding setStates to Context. */
export type SetState<T> = Dispatch<SetStateAction<T>>;
