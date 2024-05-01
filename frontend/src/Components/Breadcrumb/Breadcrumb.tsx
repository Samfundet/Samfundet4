import { UIMatch, useMatches } from 'react-router-dom';
import { ReactNode } from 'react';
import styles from './Breadcrumb.module.scss';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { Link } from '~/Components';
import { Icon } from '@iconify/react';

type HandleWithCrumb = {
  crumb: () => ReactNode;
};

interface MatchWithCrumb extends UIMatch {
  handle: HandleWithCrumb;
}

export function Breadcrumb() {
  const matches = useMatches();

  const crumbs = matches
    .filter((match) => Boolean((match as MatchWithCrumb).handle?.crumb))
    .map((match) => (match as MatchWithCrumb).handle?.crumb());

  return (
    <div className={styles.breadcrumb}>
      <div className={styles.icon_wrap}>
        <Link url={ROUTES_FRONTEND.home}>
          <Icon icon="ion:home" className={styles.icon} />
        </Link>
      </div>
      {crumbs.map((crumb, i) => (
        <div key={i}>
          <span>&nbsp;&gt;&nbsp;</span>
          {crumb}
        </div>
      ))}
    </div>
  );
}
