import { Icon } from '@iconify/react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumb.module.scss';
import { BREADCRUMB_TITLES } from '~/constants/BreadCrumbTitles';
import { useTranslation } from 'react-i18next';

export function Breadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const baseUrl = 'http://localhost:3000';

  let url = '';
  const breadcrumbLinks = segments.map((segment, i) => {
    const title = t(BREADCRUMB_TITLES[url + '/' + segment]);
    url += '/' + segment;
    //Removes part segments containing an ID
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
