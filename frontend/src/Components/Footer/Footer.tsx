import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Link } from '~/Components';
import {
  isfit,
  isfitWhite,
  kulturrom,
  kulturromWhite,
  reitan,
  reitanWhite,
  trondheim,
  trondheimWhite,
  uka,
  ukaWhite,
} from '~/assets';
import { THEME } from '~/constants';
import { useGlobalContext } from '~/context/GlobalContextProvider';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './Footer.module.scss';

export function Footer() {
  const { t } = useTranslation();

  const { theme } = useGlobalContext();

  const iconColor = theme === THEME.DARK ? 'white' : 'black';
  const trondheimLogo = theme === THEME.DARK ? trondheimWhite : trondheim;
  const kulturromLogo = theme === THEME.DARK ? kulturromWhite : kulturrom;
  const reitanLogo = theme === THEME.DARK ? reitanWhite : reitan;
  const ukaLogo = theme === THEME.DARK ? ukaWhite : uka;
  const isfitLogo = theme === THEME.DARK ? isfitWhite : isfit;

  const sponsorsAndOrgs = (
    <div className={styles.sponsors_and_orgs}>
      <div>
        <h2 className={styles.header}>{t(KEY.common_sponsor)}</h2>
        <div className={styles.logo_row}>
          <Link className={styles.logo_link} target="external" url="https://www.trondheim.kommune.no/">
            <img src={trondheimLogo} className={styles.logo} alt="Trondheim Kommune" />
          </Link>
          <Link className={styles.logo_link} target="external" url="https://kulturrom.no/">
            <img src={kulturromLogo} className={styles.logo} style={{ padding: '0.5rem 0' }} alt="Kulturrom" />
          </Link>
          <Link className={styles.logo_link} target="external" url="https://reitan.no/no">
            <img src={reitanLogo} className={styles.logo} alt="Reitan" />
          </Link>
        </div>
      </div>
      <div>
        <h2 className={styles.header}>{t(KEY.common_festivals)}</h2>
        <div className={styles.logo_row}>
          <Link className={styles.logo_link} target="external" url="https://www.uka.no/">
            <img src={ukaLogo} className={styles.logo} style={{ padding: '0.75rem 0' }} alt="UKA" />
          </Link>
          <Link className={styles.logo_link} target="external" url="https://www.isfit.org/">
            <img src={isfitLogo} className={styles.logo} alt="ISFiT" />
          </Link>
        </div>
      </div>
    </div>
  );

  const contact = (
    <div className={styles.contact}>
      <h2 className={styles.header}>{t(KEY.common_contact)}</h2>
      <div>
        <p>© Studentersamfundet i Trondhjem 2023</p>
        <p>Org.nr: 970 088 466</p>
        <p>Elgeseter gate 1</p>
        <p>7030</p>
      </div>
    </div>
  );

  const socials = (
    <div className={styles.socials}>
      <Link target="external" url="https://www.facebook.com/samfundet">
        <Icon color={iconColor} icon="bi:facebook" width={20} />
      </Link>
      <Link target="external" url="https://www.instagram.com/samfundet/">
        <Icon color={iconColor} icon="bi:instagram" width={20} />
      </Link>
      <Link target="external" url="https://www.tiktok.com/@samfundet">
        <Icon color={iconColor} icon="bi:tiktok" width={20} />
      </Link>
      <Link target="external" url="https://www.snapchat.com/add/samfundet">
        <Icon color={iconColor} icon="bi:snapchat" width={20} />
      </Link>
    </div>
  );

  const extraInfo = (
    <div className={styles.extra_info}>
      <div>
        {t(KEY.we_use_cookies)}{' '}
        <Link target="external" url="https://www.whatarecookies.com/">
          {t(KEY.common_here)}
        </Link>
      </div>

      <Link url={ROUTES.frontend.contributors} plain className={styles.contributors_link}>
        {t(KEY.footer_developed_by)}
      </Link>
    </div>
  );

  return (
    <div className={styles.container}>
      {sponsorsAndOrgs}

      <div className={styles.main_footer}>
        {contact}
        {socials}
        {extraInfo}
      </div>
    </div>
  );
}
