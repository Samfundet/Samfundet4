import { Icon } from '@iconify/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { BreadcrumbTitles } from '~/constants/BreadcrumbTitles';
import styles from './Breadcrumb.module.scss';

export function Breadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const baseUrl = 'http://localhost:3000';

  let url = '';
  const breadcrumbLinks = segments.map((segment, i) => {
    url += '/' + segment;
    const title = t(BreadcrumbTitles[url]);
    //Removes segments containing an ID
    if (/\d/.test(segment)) {
      return null;
    }
    return (
      <React.Fragment key={i}>
        <span className={styles.separator}>&nbsp;&gt;&nbsp;</span>
        <Link to={baseUrl + url} className={styles.link}>
          {title}
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
