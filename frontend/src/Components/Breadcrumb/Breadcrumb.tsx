import { Icon } from '@iconify/react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumb.module.scss';

export function Breadcrumb() {
  const location = useLocation();
  const { pathname } = location;
  const segments = pathname.split('/').filter(Boolean);
  const baseUrl = 'http://localhost:3000';

  let url = '';
  const breadcrumbLinks = segments.map((segment, i) => {
    url += '/' + segment;
    return (
      <React.Fragment key={i}>
        <span className={styles.separator}>&nbsp;&gt;&nbsp;</span>
        <Link to={baseUrl + url} className={styles.link}>
          {segment}
        </Link>
      </React.Fragment>
    );
  });

  return (
    <div className={styles.breadcrumb}>
      <div className={styles.icon_wrap}>
        <Link to={baseUrl}>
          <Icon icon="ion:home" className={styles.icon} />
        </Link>
      </div>
      <div className={styles.titles}>{breadcrumbLinks}</div>
    </div>
  );
}
