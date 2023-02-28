import classNames from 'classnames';
import { FieldValues, UseFormRegister } from 'react-hook-form/dist/types';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { Children } from '~/types';
import styles from './FormInputField.module.scss';

type types = 'text' | 'number' | 'email' | 'password' | 'image' | 'datetime-local' | 'file';

type FormInputFieldProps = {
  children?: Children;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  type?: types;
  name: string;
  register?: UseFormRegister<FieldValues>;
  required?: boolean;
  helpText?: string;
  errors?: Record<string, unknown>;
};

export function FormInputField({
  children,
  className,
  labelClassName,
  inputClassName,
  errors,
  name,
  required,
  register,
  helpText,
  type = 'text',
}: FormInputFieldProps) {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <label className={classNames(styles.label, labelClassName)}>
        {children}
        <input
          placeholder={required ? t(KEY.common_required) : ''}
          required
          className={classNames(styles.input_field, inputClassName, errors && name in errors && styles.errors)}
          type={type}
          {...(register && register(name, { required }))}
        />
        {errors && name in errors && <div className={styles.errors_text}>{errors[name].message}</div>}
      </label>
      {helpText && <p className={styles.helpText}>{helpText}</p>}
    </div>
  );
}
