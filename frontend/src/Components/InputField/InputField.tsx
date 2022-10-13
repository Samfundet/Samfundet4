import classNames from 'classnames';
import styles from './InputField.module.scss';

type InputTheme = 'samf' | 'secondary';

type InputFieldProps = {
  placeholder?: string;
  className?: string;
  theme?: InputTheme;
  type?: string;
  onChange?: (e: any) => void;
};

const mapThemeToStyle: { [theme in InputTheme]: string } = {
  samf: styles.input_samf,
  secondary: styles.input_secondary,
};

export function InputField({ placeholder, className, type, onChange, theme = 'samf' }: InputFieldProps) {
  const classnames = classNames(mapThemeToStyle[theme], className);
  return <input placeholder={placeholder} className={classnames} type={type} onChange={onChange} />;
}
