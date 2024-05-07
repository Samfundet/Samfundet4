import { SamfError } from './SamfForm';

// isse 1091

// ---------------------------------- //
//             Validators             //
// -----------------------------------//
export const validPhonenumber = (value: string): SamfError => {
  if (value.length === 0) {
    return 'Please enter a phone number';
  }
  if (!/^\d+$/.test(value)) {
    return 'Please enter a valid phone number';
  }
  return true;
};

export const validEmail = (value: string): SamfError => {
  if (value.length === 0) {
    return 'Please enter an email';
  }
  if (!/^.+@.+\..+$/.test(value)) {
    return 'Please enter a valid email';
  }
  return true;
};
