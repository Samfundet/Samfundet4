import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { getGang } from '~/api';
import { BreadcrumbTitles } from '~/constants/BreadcrumbTitles';
import { GangDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './Breadcrumb.module.scss';

export function Breadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const baseUrl = 'http://localhost:3000';
  const [gang, setGang] = useState<Partial<GangDto>>({});

  useEffect(() => {
    segments.forEach((segment) => {
      if (segment == 'gang') {
        const gangId = segments[segments.indexOf('gang') + 1];
        getGang(gangId)
          .then((gang) => {
            setGang(gang);
          })
          .catch((error) => console.error('Error fetching gang:', error));
      }
    });
  }, []);
  let url = '';
  const breadcrumbLinks = segments.map((segment, i) => {
    url += '/' + segment;
    //TODO: Make the breacrumb titles url with id right
    let title = t(BreadcrumbTitles[url]);
    if (url.includes('position')) {
      title = 'Søknader';
    } else if (
      url.includes('gang') &&
      gang.name_nb != undefined &&
      !url.includes('gang-overview') &&
      !url.includes('position')
    ) {
      title = gang.name_nb;
    } else if (url.includes('gang-overview')) {
      title = t(KEY.admin_information_manage_title);
    }
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
