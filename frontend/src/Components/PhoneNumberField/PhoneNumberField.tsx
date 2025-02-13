import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputField, type InputFieldProps } from '~/Components';
import { PHONENUMBER_REGEX } from '~/constants';
import { KEY } from '~/i18n/constants';

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
  const { t } = useTranslation();
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
      error={isCorrectFormat ? error : t(KEY.invalid_phonenumber)}
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
