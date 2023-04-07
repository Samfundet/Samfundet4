import classNames from 'classnames';
import { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_DOMAIN } from '~/constants';
import { Children } from '~/types';
import styles from './Link.module.scss';

export type LinkProps = {
  className?: string;
  style?: CSSProperties;
  underline?: boolean;
  url: string;
  title?: string;
  plain?: boolean;
  target?: 'frontend' | 'backend' | 'external' | 'email';
  children?: Children;
};

export function Link({ underline, className, style, children, url, title, plain, target = 'frontend' }: LinkProps) {
  const navigate = useNavigate();

  const finalUrl = target === 'backend' ? BACKEND_DOMAIN + url : url;

  function handleClick(event: React.MouseEvent) {
    // Stop default <a> tag onClick handling. We want custom behaviour depending on the target.
    event.preventDefault();

    // Even though nested <a> tags are illegal, they might occur.
    // To prevent multiple link clicks on overlaying elements, stop propagation upwards.
    event.stopPropagation();

    /** Detected desire to open the link in a new tab.
     * True if ctrl or cmd click.
     */
    const isCmdClick = event.ctrlKey || event.metaKey;

    // React navigation.
    if (target === 'frontend' && !isCmdClick) {
      navigate(url);
    }
    // Normal change of href to trigger reload.
    else if (target === 'backend' && !isCmdClick) window.location.href = finalUrl;
    else if (target === 'email') window.location.href = url;
    // Open in new tab.
    else window.open(finalUrl, '_blank');
  }
  return (
    <a
      className={classNames(className, !plain && styles.link, underline && styles.underline)}
      title={title}
      style={style}
      onClick={(e) => handleClick(e)}
      href={finalUrl}
    >
      {children}
    </a>
  );
}
