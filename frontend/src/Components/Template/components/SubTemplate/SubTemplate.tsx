import classnames from 'classnames';
import type { ReactNode } from 'react';
import styles from './SubTemplate.module.scss';

type SubTemplateProps = {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
};

export function SubTemplate({ className, children, onClick }: SubTemplateProps) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: only used for demo...
    <div onClick={onClick} className={classnames(styles.sub_template, className)}>
      {children}
    </div>
  );
}
