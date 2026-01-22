import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Link, Logo } from '~/Components';
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
  sit,
  sparebank1,
} from '~/assets';
import { THEME } from '~/constants';
import { useGlobalContext } from '~/context/GlobalContextProvider';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { ROUTES_SAMF_THREE } from '~/routes/samf-three';
import styles from './Footer.module.scss';

export function Footer() {
  const { t } = useTranslation();

  const { theme } = useGlobalContext();

  const iconColor = theme === THEME.DARK ? 'white' : 'white';
  const trondheimLogo = theme === THEME.DARK ? trondheimWhite : trondheim;
  const kulturromLogo = theme === THEME.DARK ? kulturromWhite : kulturrom;
  const reitanLogo = theme === THEME.DARK ? reitanWhite : reitan;
  const ukaLogo = theme === THEME.DARK ? ukaWhite : uka;
  const isfitLogo = theme === THEME.DARK ? isfitWhite : isfit;

  const sponsorsAndOrgs = (
    <div className={styles.sponsors_and_orgs}>
      <div>
        <h2 className={styles.sponsors_header}>{t(KEY.common_sponsor)}</h2>
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
          <Link className={styles.logo_link} target="external" url="https://www.sit.no/">
            <img src={sit} className={styles.logo} alt="Sit" />
          </Link>
          <Link className={styles.logo_link} target="external" url="https://www.sparebank1.no/nb/smn/privat.html">
            <img src={sparebank1} className={styles.logo} alt="SpareBank 1 SMN" />
          </Link>
        </div>
      </div>
      <div>
        <h2 className={styles.sponsors_header}>{t(KEY.common_festivals)}</h2>
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

  const logo = (
    <div className={styles.logo_section}>
      <Logo organization="Samfundet" color="light" size="xsmall" />
    </div>
  );

  const contact = (
    <div className={styles.footer_section}>
      <h2 className={styles.section_title}>
        {t(KEY.footer_have_questions)}{' '}
        {/*TODO: Replace samf3 contact link with samf4 */}
        <Link plain className={styles.contact_link} target="samf3" url={ROUTES_SAMF_THREE.information.contact}>
          {t(KEY.common_contact_us)}
        </Link>
      </h2>
      <ul className={styles.contact_list}>
        <li className={styles.contact_item}>
          <Icon icon="mdi:map-marker" width={18} className={styles.contact_icon} />
          <Link
            className={styles.footer_link}
            target="external"
            url="https://maps.google.com/?q=Elgeseter+gate+1,+7030+Trondheim"
          >
            Elgeseter gate 1, 7030 Trondheim
          </Link>
        </li>
        <li className={styles.contact_item}>
          <Icon icon="mdi:domain" width={18} className={styles.contact_icon} />
          <span>Org.nr: 970 088 466</span>
        </li>
      </ul>
      <div className={styles.copyright}>© Studentersamfundet i Trondhjem 2024</div>
    </div>
  );

  const socials = (
    <div className={styles.socials}>
      <Link className={styles.social_link} target="external" url="https://www.facebook.com/samfundet">
        <Icon color={iconColor} icon="bi:facebook" width={24} />
      </Link>
      <Link className={styles.social_link} target="external" url="https://www.instagram.com/samfundet/">
        <Icon color={iconColor} icon="bi:instagram" width={24} />
      </Link>
      <Link className={styles.social_link} target="external" url="https://www.tiktok.com/@samfundet">
        <Icon color={iconColor} icon="bi:tiktok" width={24} />
      </Link>
      <Link className={styles.social_link} target="external" url="https://www.snapchat.com/add/samfundet">
        <Icon color={iconColor} icon="bi:snapchat" width={24} />
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

  const shortcuts = (
    <div className={styles.footer_section}>
      <h2 className={styles.section_title}>{t(KEY.common_shortcuts)}</h2>
      <ul className={styles.footer_list}>
        <li className={styles.footer_list_item}>
          <Link className={styles.footer_link} target="samf3" url={ROUTES_SAMF_THREE.information.general}>
            {t(KEY.common_general)}
          </Link>
        </li>
        <li className={styles.footer_list_item}>
          <Link className={styles.footer_link} target="samf3" url={ROUTES_SAMF_THREE.information.membership}>
            {t(KEY.common_membership)}
          </Link>
        </li>
        <li className={styles.footer_list_item}>
          <Link className={styles.footer_link} target="samf3" url={ROUTES_SAMF_THREE.information.openingHours}>
            {t(KEY.common_opening_hours)}
          </Link>
        </li>
        <li className={styles.footer_list_item}>
          <Link className={styles.footer_link} target="samf3" url={ROUTES_SAMF_THREE.information.photos}>
            {t(KEY.common_photos)}
          </Link>
        </li>
        <li className={styles.footer_list_item}>
          <Link className={styles.footer_link} target="samf3" url={ROUTES_SAMF_THREE.information.renting}>
            {t(KEY.common_renting)}
          </Link>
        </li>
      </ul>
    </div>
  );

  const venues = (
    <div className={styles.footer_section}>
      <h2 className={styles.section_title}>{t(KEY.common_venues)}</h2>
      <ul className={styles.footer_list}>
        <li className={styles.footer_list_item}>
          <Link className={styles.footer_link} target="samf3" url={ROUTES_SAMF_THREE.venues.restaurant}>
            {t(KEY.common_restaurant)}
          </Link>
        </li>
        <li className={styles.footer_list_item}>
          <Link className={styles.footer_link} target="samf3" url={ROUTES_SAMF_THREE.venues.bar}>
            {t(KEY.common_bar)}
          </Link>
        </li>
        <li className={styles.footer_list_item}>
          <Link className={styles.footer_link} target="samf3" url={ROUTES_SAMF_THREE.venues.scene}>
            {t(KEY.common_stages)}
          </Link>
        </li>
        <li className={styles.footer_list_item}>
          <Link className={styles.footer_link} target="samf3" url={ROUTES_SAMF_THREE.venues.club}>
            {t(KEY.common_club)}
          </Link>
        </li>
      </ul>
    </div>
  );

  return (
    <div className={styles.container}>
      {sponsorsAndOrgs}

      <div className={styles.main_footer}>
        <div className={styles.desktop_logo}>{logo}</div>
        <div className={styles.footer_section_holder}>
          <div className={styles.contact_and_socials}>
            {contact}
            {socials}
          </div>
          <div className={styles.shortcuts_and_venues}>
            {shortcuts}
            {venues}
          </div>
        </div>
        <div className={styles.mobile_logo}>{logo}</div>
        {extraInfo}
      </div>
    </div>
  );
}
