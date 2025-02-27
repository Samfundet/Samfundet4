import classnames from 'classnames';
import styles from './Badge.module.scss';

type BadgeProps = {
  text?: string;
  className?: string;
};

export function Badge({ text, className, ...props }: BadgeProps) {
  return <div className={classnames(styles.badge, className)} {...props} />;
}
