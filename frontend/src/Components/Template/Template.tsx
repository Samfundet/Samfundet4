import classnames from 'classnames';
import { SubTemplate } from '~/Components/Template/components';
import { Children } from '~/types';
import styles from './Template.module.scss';

type TemplateProps = {
  className?: string;
  children?: Children;
  onClick?: () => void;
};

/**
 * Only a template, see README.
 */
export function Template({ className, children, onClick }: TemplateProps) {
  return (
    <div onClick={onClick} className={classnames(styles.template, className)}>
      <SubTemplate>{children}</SubTemplate>
    </div>
  );
}
