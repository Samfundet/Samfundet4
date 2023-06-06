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
      <div className={styles.item_row}>
        <div className={styles.parts}>
          <div className={styles.column}>
            <h1 className={styles.header}>{t(KEY.common_contact)}</h1>
            <div>
              <p>© Studentersamfundet i Trondhjem 2023</p>
              <p>Org.nr: 970 088 466</p>
              <p>Elgeseter gate 1</p>
              <p>7030</p>
            </div>
          </div>
        </div>
        <div className={classNames(styles.parts, styles.column)}>
          <div className={styles.colab_item}>
            <h1 className={styles.header}>Sponsors:</h1>
            <div className={styles.image_row}>
              <Link className={styles.sponsor_logo} target="external" url="https://www.facebook.com/samfundet">
                <Image src={trondhemSponsor} height={64}></Image>
              </Link>
              <Link className={styles.sponsor_logo} target="external" url="https://www.facebook.com/samfundet">
                <Image src={kulturromSponsor} height={64}></Image>
              </Link>
              <Link className={styles.sponsor_logo} target="external" url="https://www.facebook.com/samfundet">
                <Image src={reitanSponsor} height={64}></Image>
              </Link>
            </div>
          </div>
          <div className={styles.media_container}>
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
        </div>
        <div className={styles.parts}>
          <div className={styles.colum}>
            <div className={styles.colab_item}>
              <h1 className={styles.header}>Festivals:</h1>
              <div className={styles.image_row}>
                <Link className={styles.sponsor_logo} target="external" url="https://www.facebook.com/samfundet">
                  <Image src={ukaWhite} height={64}></Image>
                </Link>
                <Link className={styles.sponsor_logo} target="external" url="https://www.facebook.com/samfundet">
                  <Image src={isfit} height={64}></Image>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cookies}>
        <p>Vi bruker cookies for å gi deg en best mulig opplevelse på Samfundet.no. Les mer om cookies her. </p>
      </div>
    </div>
  );
}

/**
 * 
 * 
 *       <div className={styles.general}>
        <SamfundetLogo className={styles.samfLogo} />
          <div className={styles.center_container}>
            <SamfundetLogo className={styles.samfLogo} />
            <div className={styles.media_container}>
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
        </div>
      </div>
*       <div className={styles.colab}>
        <div className={styles.colab_item}>
          <h1>Sponsors:</h1>
          <div className={styles.image_row}>
            <Link className={styles.sponsor_logo} target="external" url="https://www.facebook.com/samfundet">
              <Image src={trondhemSponsor} height={64}></Image>
            </Link>
            <Link className={styles.sponsor_logo} target="external" url="https://www.facebook.com/samfundet">
              <Image src={kulturromSponsor} height={64}></Image>
            </Link>
            <Link className={styles.sponsor_logo} target="external" url="https://www.facebook.com/samfundet">
              <Image src={reitanSponsor} height={64}></Image>
            </Link>
          </div>
        </div>
        <div className={styles.colab_item}>
          <h1>Festivals:</h1>
          <div className={styles.image_row}>
            <Link className={styles.sponsor_logo} target="external" url="https://www.facebook.com/samfundet">
              <Image src={uka} height={64}></Image>
            </Link>
            <Link className={styles.sponsor_logo} target="external" url="https://www.facebook.com/samfundet">
              <Image src={isfit} height={64}></Image>
            </Link>
          </div>
        </div>
      </div>
 */
