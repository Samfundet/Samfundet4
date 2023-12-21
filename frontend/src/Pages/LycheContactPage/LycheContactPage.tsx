import { Icon } from '@iconify/react';
import { Link } from '~/Components/Link/Link';
import { SultenPage } from '~/Components/SultenPage';
import { TextItem } from '~/constants/TextItems';
import { useTextItem } from '~/hooks';
import { ROUTES } from '~/routes';
import styles from './LycheContactPage.module.scss';

export function LycheContactPage() {
  return (
    <>
      <SultenPage>
        <div className={styles.contactContainer}>
          <div className={styles.textContainer}>
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
            ></iframe>
          </div>
        </div>
      </SultenPage>
    </>
  );
}
