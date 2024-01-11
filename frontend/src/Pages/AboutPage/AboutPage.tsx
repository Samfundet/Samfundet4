import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Carousel } from '~/Components';
import { Page } from '~/Components/Page';
import { runderode, splash } from '~/assets';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { backgroundImageFromUrl } from '~/utils';
import styles from './AboutPage.module.scss';
import { VENUES } from './data';

export function AboutPage() {
  const { t } = useTranslation();
  return (
    <Page>
      <div className={styles.row}>
        <img src={runderode} alt="Runderode" className={classNames(styles.runderode, styles.box)} />
        <div className={styles.textBox}>
          <h2 className={styles.header}>{t(KEY.command_menu_shortcut_about_samfundet)}</h2>
          <p className={styles.text}>{t(KEY.about_samfundet_info)}</p>
          <Button theme="samf" className={styles.button}>
            {t(KEY.common_membership).toUpperCase()}
          </Button>
          <Button theme="success" className={styles.button}>
            FAQ
          </Button>
          <Button theme="blue" className={styles.button}>
            {t(KEY.common_contact_us).toUpperCase()}
          </Button>
          <Button theme="outlined" className={styles.button}>
            {t(KEY.common_ticket_type).toUpperCase()}
          </Button>
        </div>
      </div>
      <div className={classNames(styles.box, styles.textBox)}>
        <h2 className={styles.header}>{t(KEY.samfundsmøtet)}</h2>
        <p className={styles.text}>{t(KEY.samfundsmøtet_desc)}</p>
        <Button theme="samf" className={styles.button}>
          {t(KEY.samfundet_about_the_org).toUpperCase()}
        </Button>
        <Button className={styles.button} theme="outlined">
          {t(KEY.admin_saksdokumenter).toUpperCase()}
        </Button>
        <Button className={styles.button} theme="outlined">
          {t(KEY.samfundets_historie).toUpperCase()}
        </Button>
      </div>
      <h2 className={styles.header2}>{t(KEY.common_venues)}</h2>

      <Carousel spacing={1.5} header>
        {VENUES.images.map((image, idx) => {
          return (
            <div key={idx}>
              <div className={styles.venue_bubble} style={backgroundImageFromUrl(image.src)}></div>
              <div className={styles.venue_name}>{image.name}</div>
            </div>
          );
        })}
      </Carousel>

      <div className={styles.row}>
        <Button className={styles.button} theme="outlined">
          {t(KEY.common_overview_map).toUpperCase()}
        </Button>
        <Button className={styles.button} theme="outlined">
          {t(KEY.navbar_nybygg).toUpperCase()}
        </Button>
      </div>
      <div className={styles.row}>
        <div className={styles.image_box}>
          <img src={splash} alt="Splash" className={styles.splash} />
          <div className={styles.textBox}>
            <h2 className={styles.header}>{t(KEY.common_volunteering)}</h2>
            <p className={styles.text}>{t(KEY.volunteering_info)}</p>
            <div className={styles.buttonTable}>
              <Button className={styles.tableButton} theme="basic" link={ROUTES.frontend.groups}>
                {t(KEY.the_groups_at_samfundet).toUpperCase()}
              </Button>
              <Button className={styles.tableButton} theme="basic">
                {t(KEY.recruitment_admission).toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.uka_isfit}>
            <h3 className={styles.header_col}>UKA & ISFiT</h3>
            <p className={styles.text}>{t(KEY.uka_isfit_info)}</p>
            <div className={styles.buttonTable}>
              <Button className={styles.tableButton} theme="samf">
                UKA
              </Button>
              <Button className={styles.tableButton} theme="blue">
                ISFiT
              </Button>
            </div>
          </div>
          <div className={styles.other_info}>
            <h3 className={styles.header_col}>{t(KEY.common_other_info)}</h3>
            <div className={styles.buttonTable}>
              <Button className={styles.tableButton} theme="basic">
                {t(KEY.common_age_limit).toUpperCase()}
              </Button>
              <Button className={styles.tableButton} theme="basic">
                BOOKING
              </Button>
              <Button className={styles.tableButton} theme="basic">
                QUIZ
              </Button>
              <Button className={styles.tableButton} theme="basic">
                {t(KEY.renting_and_other_services).toUpperCase()}
              </Button>
              <Button className={styles.tableButton} theme="basic">
                {t(KEY.common_press).toUpperCase()}
              </Button>
              <Button className={styles.tableButton} theme="basic">
                {t(KEY.common_film_club).toUpperCase()}
              </Button>
              <Button className={styles.tableButton} theme="basic">
                {t(KEY.common_privacy_policy).toUpperCase()}
              </Button>
              <Button className={styles.tableButton} theme="basic">
                {t(KEY.common_facilitation).toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
