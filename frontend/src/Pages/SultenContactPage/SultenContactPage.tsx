import { Icon } from '@iconify/react';
import { Link } from '~/Components/Link/Link';
import { SultenPage } from '~/Components/SultenPage';
import { TextItem } from '~/constants/TextItems';
import { useTextItem } from '~/hooks';
import { ROUTES } from '~/routes';
import styles from './SultenContactPage.module.scss';

export function SultenContactPage() {
  return (
    <>
      <SultenPage>
        <div className={styles.contactContainer}>
          <div className={styles.textContainer}>
            <h1 className={styles.sultenContactTitle}>{useTextItem(TextItem.sulten_contact_page_title)}</h1>
            <p className={styles.sultenContactText}>{useTextItem(TextItem.sulten_contact_page_text)}</p>
            <p className={styles.contactAddress}>booking-lyche@uka.no</p>
            <p className={styles.contactAddress}>Elgesetergate 1</p>
            <div className={styles.sultenSocialsContainer}>
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
          <div className={styles.sultenMapContainer}>
            <iframe
              className={styles.sultenStreet}
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
