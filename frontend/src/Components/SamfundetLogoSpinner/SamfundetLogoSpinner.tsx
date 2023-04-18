import classNames from 'classnames';
import { SamfundetLogo } from '~/Components/SamfundetLogo/SamfundetLogo';
import styles from './SamfundetLogoSpinner.module.scss';

type SamfundetLogoSpinnerProps = {
  className?: string;
};

export function SamfundetLogoSpinner({ className }: SamfundetLogoSpinnerProps) {
  const classnames = classNames(className, styles.spinning_logo);
  return <SamfundetLogo className={classnames} />;
}
