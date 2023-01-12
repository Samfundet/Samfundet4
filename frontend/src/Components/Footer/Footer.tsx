import { useTranslation } from 'react-i18next';
import { SocialIcon } from 'react-social-icons';
import { isfit, kulturRom, reitan, trondheimKommune, uka } from '~/assets';
import { KEY } from '~/i18n/constants';
import styles from './Footer.module.scss';

type FooterProps = {
  iconSize: number;
};

export function Footer({ iconSize }: FooterProps) {
  const { t } = useTranslation();
  return (
    <div>
      <div className={styles.sponsor}>
        <ul className={styles.centerUL}>
          <li className={styles.horisontalLi}>
            <ul className={styles.centerUL}>
              <li>{t(KEY.footer_sponsors)}</li>
              <li className={styles.horisontalLi}>
                <span className={styles.sponsorBox}>
                  <a href="https://www.trondheim.kommune.no/">
                    <img src={trondheimKommune} className={styles.kommuneIcon} />
                  </a>
                  <a href="https://www.trondheim.kommune.no/">Trondheim Kommune</a>
                </span>
                <span className={styles.sponsorBox}>
                  <a href="https://www.kulturrom.no/">
                    <img src={kulturRom} className={styles.kulturromIcon} />
                  </a>
                </span>
                <span className={styles.sponsorBox}>
                  <a href="https://reitan.no/no">
                    <img src={reitan} className={styles.reitanIcon} />
                  </a>
                </span>
              </li>
            </ul>
          </li>
          <li className={styles.horisontalLi}>
            <ul className={styles.centerUL}>
              <li>{t(KEY.footer_festivals)}</li>
              <li className={styles.horisontalLi}>
                <span className={styles.sponsorBox}>
                  <a href="https://www.isfit.org/">
                    <img src={isfit} className={styles.isfitIcon} />
                  </a>
                </span>
                <span className={styles.sponsorBox}>
                  <a href="https://uka.no">
                    <img src={uka} className={styles.ukaIcon} />
                  </a>
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className={styles.social}>
        <ul>
          <li>
            <a href={'https://www.samfundet.no/informasjon/kontaktinfo'} className={styles.contact}>
              {t(KEY.footer_contact)}
            </a>
          </li>
        </ul>
        <ul>
          <li>
            <span className={styles.leftbox}>
              <SocialIcon url="https://facebook.com/samfundet" style={{ height: iconSize, width: iconSize }} />
            </span>
            <span className={styles.rightbox}>&copy; Studentersamfundet i Trondhjem</span>
          </li>
          <li>
            <span className={styles.leftbox}>
              <SocialIcon url="https://instagram.com/samfundet" style={{ height: iconSize, width: iconSize }} />
            </span>
            <span className={styles.rightbox}>Org.nr: 970 088 466</span>
          </li>
          <li>
            <span className={styles.leftbox}>
              <SocialIcon url="https://www.tiktok.com/@samfundet" style={{ height: iconSize, width: iconSize }} />
            </span>
            <span className={styles.rightbox}>Elgeseter gate 1 </span>
          </li>
          <li>
            <div className={styles.leftbox}>
              <SocialIcon url="https://twitter.com/samfundet" style={{ height: iconSize, width: iconSize }} />
            </div>
            <div className={styles.rightbox}>7030 Trondheim</div>
          </li>
        </ul>
        <ul>
          <li>
            <p className={styles.cookies}>{t(KEY.footer_cookies1)} &nbsp; </p>
            <a href={'http://www.whatarecookies.com/'} className={styles.cookies}>
              {t(KEY.footer_cookies2)}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
