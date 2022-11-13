import classNames from 'classnames';
import { SamfundetLogo } from '~/Components/SamfundetLogo/SamfundetLogo';
import './SamfundetLogoSpinner.scss';

type SamfundetLogoSpinnerProps = {
  className?: string;
};

export function SamfundetLogoSpinner({ className }: SamfundetLogoSpinnerProps) {
  const classnames = classNames(className, 'samfundet-logo-spinner');
  return <SamfundetLogo className={classnames} />;
}
