import classNames from 'classnames';
import { SamfundetLogo } from '~/Components/SamfundetLogo/SamfundetLogo';
import styles from './SamfundetLogoSpinner.module.scss';

type SamfundetLogoSpinnerProps = {
  className?: string;
  position?: 'center' | 'left' | 'right';
};

export function SamfundetLogoSpinner({ className, position }: SamfundetLogoSpinnerProps) {
  const classnames = classNames(className, styles.spinning_logo);
  return (
    <div className={position && styles[position]}>
      <SamfundetLogo className={classnames} />
    </div>
  );
}
