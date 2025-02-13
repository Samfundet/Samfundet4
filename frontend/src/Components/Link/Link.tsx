import classNames from 'classnames';
import type { CSSProperties } from 'react';
import { BACKEND_DOMAIN } from '~/constants';
import { useCustomNavigate } from '~/hooks';
import type { Children } from '~/types';
import styles from './Link.module.scss';

export type LinkTarget = 'frontend' | 'backend' | 'external' | 'email';

export type LinkProps = {
  className?: string;
  style?: CSSProperties;
  underline?: boolean;
  url: string;
  title?: string;
  plain?: boolean;
  target?: LinkTarget;
  onAfterClick?: () => void;
  children?: Children;
};

export function Link({
  underline,
  className,
  style,
  children,
  url,
  title,
  plain,
  target = 'frontend',
  onAfterClick,
}: LinkProps) {
  const navigate = useCustomNavigate();
  const finalUrl = target === 'backend' ? BACKEND_DOMAIN + url : url;

  function handleClick(event: React.MouseEvent) {
    navigate({ linkTarget: target, url: url, event: event });

    // External callback can add additional functionality on click.
    onAfterClick?.();
  }
  return (
    <a
      className={classNames(className, !plain && styles.link, underline && styles.underline)}
      title={title}
      style={style}
      onClick={handleClick}
      href={finalUrl}
    >
      {children}
    </a>
  );
}
