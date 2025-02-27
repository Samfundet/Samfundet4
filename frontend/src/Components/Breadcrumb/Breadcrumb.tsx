import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import { type UIMatch, useMatches } from 'react-router';
import { Link } from '~/Components';
import { ROUTES } from '~/routes';
import styles from './Breadcrumb.module.scss';

type HandleWithCrumb = {
  crumb: (match: UIMatch, data?: unknown) => ReactNode;
};

interface MatchWithCrumb extends UIMatch {
  handle: HandleWithCrumb;
}

export function Breadcrumb() {
  const matches = useMatches();

  const crumbs = matches
    .filter((match) => Boolean((match as MatchWithCrumb).handle?.crumb))
    .map((match) => (match as MatchWithCrumb).handle?.crumb(match, match.data));

  return (
    <div className={styles.breadcrumb}>
      <Link url={ROUTES.frontend.home} className={styles.link}>
        <Icon icon="ion:home" className={styles.icon} />
      </Link>
      {crumbs.map((crumb, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
        <div key={i}>
          <span className={styles.separator}>&gt;</span>
          {crumb}
        </div>
      ))}
    </div>
  );
}
