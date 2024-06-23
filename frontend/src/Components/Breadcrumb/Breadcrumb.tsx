import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import { type UIMatch, useMatches } from 'react-router-dom';
import { Link } from '~/Components';
import { ROUTES } from '~/routes';
import styles from './Breadcrumb.module.scss';

type HandleWithCrumb = {
  crumb: (data?: unknown) => ReactNode;
};

interface MatchWithCrumb extends UIMatch {
  handle: HandleWithCrumb;
}

export function Breadcrumb() {
  const matches = useMatches();

  const crumbs = matches
    .filter((match) => Boolean((match as MatchWithCrumb).handle?.crumb))
    .map((match) => (match as MatchWithCrumb).handle?.crumb(match.data));

  return (
    <div className={styles.breadcrumb}>
      <Link url={ROUTES.frontend.home} className={styles.link}>
        <Icon icon="ion:home" className={styles.icon} />
      </Link>
      {crumbs.map((crumb, i) => (
        <div key={i}>
          <span className={styles.separator}>&gt;</span>
          {crumb}
        </div>
      ))}
    </div>
  );
}
