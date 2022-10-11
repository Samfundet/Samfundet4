import { Children } from '../../types';

type RadioButtonProps = {
  placeholder?: string;
  className?: string;
};

export function InputField({ placeholder, className }: RadioButtonProps) {
  return <input placeholder={placeholder} className={className} />;
}
