import { useEffect, useState } from 'react';
import { InputField, InputFieldProps } from '../InputField';
import { PHONENUMBER_REGEX } from '~/constants';

export function PhoneNumberField<T>({
  children,
  labelClassName,
  inputClassName,
  onChange,
  onBlur,
  placeholder = '',
  disabled,
  value,
  error,
  helpText,
  icon,
}: InputFieldProps<T>) {
  const [isCorrectFormat, setCorrectFormat] = useState<boolean>(false);
  useEffect(() => {
    if (value) {
      setCorrectFormat(PHONENUMBER_REGEX.test(value as string));
    }
  }, [value]);

  return (
    <InputField
      icon={icon}
      helpText={helpText}
      type="text"
      error={isCorrectFormat ? 'Not a valid phonenumber' : error}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      labelClassName={labelClassName}
      inputClassName={inputClassName}
    >
      {children}
    </InputField>
  );
}
