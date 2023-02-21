import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { Children } from '~/types';
import { BACKEND_DOMAIN } from '~/constants';
import styles from './Link.module.scss';

type LinkProps = {
  className?: string;
  underline?: boolean;
  url: string;
  target?: 'frontend' | 'backend' | 'external' | 'email';
  children?: Children;
};

export function Link({ underline, className, children, url, target = 'frontend' }: LinkProps) {
  const navigate = useNavigate();

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();

    /** Detected desire to open the link in a new tab.
     * True if ctrl or cmd click.
     */
    const isCmdClick = event.ctrlKey || event.metaKey;

    // React navigation.
    if (target === 'frontend' && !isCmdClick) navigate(url);
    // Normal change of href to trigger reload.
    else if (target === 'backend' && !isCmdClick) window.location.href = BACKEND_DOMAIN + url;
    else if (target === 'email') window.location.href = url;
    // Open in new tab.
    else window.open(url, '_blank');
  }
  return (
    <a
      className={classNames(className, {
        [styles.underline]: underline,
        [styles.regular]: !underline,
      })}
      onClick={(e) => handleClick(e)}
      href={url}
    >
      {children}
    </a>
  );
}
