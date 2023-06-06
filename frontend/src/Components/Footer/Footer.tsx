import { Icon } from '@iconify/react';
import { default as classNames } from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '~/AuthContext';
import { Button, Link, NotificationBadge, ThemeSwitch, Image, SamfundetLogo } from '~/Components';
import { useGlobalContext } from '~/GlobalContextProvider';
import { logout } from '~/api';
import {
  facebookLogo,
  instagramLogo,
  isfit,
  kulturromSponsor,
  reitanSponsor,
  samfundetLogo,
  snapchatLogo,
  tikTokLogo,
  trondhemSponsor,
  uka,
  ukaWhite,
} from '~/assets';
import { useDesktop, useIsDarkTheme, useScrollY } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY, LANGUAGES } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './Footer.module.scss';

export function Footer() {
  const isDarkTheme = useIsDarkTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.footer_container}>
      <div className={styles.main_row}>
        <div className={classNames(styles.col, styles.column)}>
          <h1 className={styles.header}>{t(KEY.common_contact)}</h1>
          <div>
            <p>© Studentersamfundet i Trondhjem 2023</p>
            <p>Org.nr: 970 088 466</p>
            <p>Elgeseter gate 1</p>
            <p>7030</p>
          </div>
        </div>
        <div className={classNames(styles.col_2, styles.column)}>
          <h1 className={styles.header}>{t(KEY.common_sponsor)}</h1>
          <div className={styles.row_collapse}>
            <Link className={styles.sponsor_logo} target="external" url="https://www.trondheim.kommune.no/">
              <Image src={trondhemSponsor} className={styles.images}></Image>
            </Link>
            <Link className={styles.sponsor_logo} target="external" url="https://kulturrom.no/">
              <Image src={kulturromSponsor} className={styles.images}></Image>
            </Link>
            <Link className={styles.sponsor_logo} target="external" url="https://reitan.no/no">
              <Image src={reitanSponsor} className={styles.images}></Image>
            </Link>
          </div>
        </div>
        <div className={classNames(styles.col, styles.column)}>
          <h1 className={styles.header}>{t(KEY.common_festivals)}</h1>
          <div className={styles.row}>
            <Link target="external" url="https://www.uka.no/">
              <Image src={ukaWhite} className={styles.images}></Image>
            </Link>
            <Link target="external" url="https://www.isfit.org/">
              <Image src={isfit} className={styles.images}></Image>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <Link target="external" url="https://www.facebook.com/samfundet">
          <Image src={facebookLogo} width={40}></Image>
        </Link>
        <Link target="external" url="https://www.instagram.com/samfundet/">
          <Image src={instagramLogo} width={40}></Image>
        </Link>
        <Link target="external" url="https://www.tiktok.com/@samfundet">
          <Image src={tikTokLogo} width={40}></Image>
        </Link>
        <Link target="external" url="https://www.snapchat.com/add/samfundet">
          <Image src={snapchatLogo} width={40}></Image>
        </Link>
      </div>
      <div className={styles.cookies}>
        <p>
          {t(KEY.we_use_cookies)}{' '}
          <Link style={{ color: 'white' }} target="external" url="https://www.whatarecookies.com/">
            {t(KEY.common_here)}
          </Link>
        </p>
      </div>
    </div>
  );
}
