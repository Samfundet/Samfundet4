import { Icon } from '@iconify/react';
import { useMatches } from 'react-router';
import { Link } from '~/Components';
import { ROUTES } from '~/routes';
import type { MatchWithCrumb } from '~/types';
import styles from './Breadcrumb.module.scss';

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
        <div key={i} className={styles.crumb}>
          <Icon icon="carbon:chevron-right" className={styles.separator} />
          {crumb}
        </div>
      ))}
    </div>
  );
}
