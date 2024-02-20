import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getGang } from '~/api';
import { GangDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './Breadcrumb.module.scss';
import { BreadcrumbTitles } from './BreadcrumbTitles';

export function Breadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const baseUrl = 'http://localhost:3000';
  const [gang, setGang] = useState<Partial<GangDto>>({});
  const gangId = useParams().gangId;

  useEffect(() => {
    if (gangId) {
      getGang(gangId)
        .then((gang) => {
          setGang(gang);
        })
        .catch((error) => console.error('Error fetching gang:', error));
    }
  }, [gangId]);
  let url = '';
  let oldTitle = '';
  let oldUrl = '';
  const recruitmentUrl = '/control-panel/recruitment/';
  const breadcrumbLinks = segments.map((segment, i) => {
    if (url == recruitmentUrl) {
      url = oldUrl;
    }
    url += '/' + segment;
    let title = t(BreadcrumbTitles[url]);
    if (url.includes('position')) {
      title = t(KEY.recruitment_applicants);
    } else if (url.includes('gang') && gang.name_nb != undefined && !url.includes('gang-overview')) {
      title = gang.name_nb;
    } else if (url.includes('gang-overview')) {
      title = t(KEY.admin_information_manage_title);
    }
    //Handles situations where this segment or det next is a numeric ID
    if (/\d/.test(segments[i + 1])) {
      oldTitle = title;
      return;
    } else if (/\d/.test(segment)) {
      title = oldTitle;
      if (segments[i - 1] == 'recruitment') {
        oldUrl = url;
        url = recruitmentUrl;
      }
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
