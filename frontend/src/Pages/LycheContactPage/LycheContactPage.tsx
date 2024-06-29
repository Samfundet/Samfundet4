import { Icon } from '@iconify/react';
import { Link } from '~/Components/Link/Link';
import { SultenPage } from '~/Components/SultenPage';
import { TextItem } from '~/constants/TextItems';
import { useTextItem, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './LycheContactPage.module.scss';
import { useTranslation } from 'react-i18next';

export function LycheContactPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.common_contact), t(KEY.common_sulten));
  return (
    <>
      <SultenPage>
        <div className={styles.contactContainer}>
          <div className={styles.textContainer}>
            <h1 className={styles.lycheContactTitle}>{useTextItem(TextItem.sulten_contact_page_title)}</h1>
            <p className={styles.lycheContactText}>{useTextItem(TextItem.sulten_contact_page_text)}</p>
            <p className={styles.contactAddress}>booking-lyche@uka.no</p>
            <p className={styles.contactAddress}>Elgesetergate 1</p>
            <div className={styles.lycheSocialsContainer}>
              <Link target="external" url={ROUTES.other.lyche_facebook}>
                <Icon className={styles.icon} color="white" icon="bi:facebook" width={40} />
              </Link>
              <Link target="external" url={ROUTES.other.sulten_instagram}>
                <Icon className={styles.icon} color="white" icon="bi:instagram" width={40} />
              </Link>
              <Link target="external" url={ROUTES.other.maps_lyche}>
                <Icon className={styles.icon} color="white" icon="carbon:map" width={40} />
              </Link>
            </div>
          </div>
          <div className={styles.lycheMapContainer}>
            <iframe
              className={styles.lycheStreet}
              src={ROUTES.other.streetview_lyche}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google street view"
            />
          </div>
        </div>
      </SultenPage>
    </>
  );
}
