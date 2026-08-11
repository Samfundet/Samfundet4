import classnames from 'classnames';
import { type ReactNode, useState } from 'react';
import styles from './ExpandableHeader.module.scss';

type HeaderThemes = 'parent' | 'child';

type ExpandableHeaderProps = {
  className?: string;
  label?: string;
  children?: ReactNode;
  showByDefault?: boolean;
  theme?: HeaderThemes;
  borderBranding?: boolean;
};

export function ExpandableHeader({
  className,
  label,
  children,
  theme = 'parent',
  showByDefault = false,
  borderBranding = false,
}: ExpandableHeaderProps) {
  const [isOpen, setIsOpen] = useState(showByDefault);

  const containerClasses = classnames(styles.container, className, {
    [styles.open]: isOpen,
    [styles.with_branding]: borderBranding,
  });

  const buttonClasses = classnames(styles.extendable_header_wrapper, isOpen ? styles.open : styles.closed);

  const arrowClasses = classnames(styles.expandable_header_arrow, isOpen ? styles.open : styles.closed);

  return (
    <div className={containerClasses}>
      <button type="button" className={buttonClasses} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
        <span className={styles.extendable_header_title}>{label}</span>
        <div className={arrowClasses} aria-hidden="true">
          <span className={styles.chevron} />
        </div>
      </button>

      {isOpen && <div className={styles.content_wrapper}>{children}</div>}
    </div>
  );
}
