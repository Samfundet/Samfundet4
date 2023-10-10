import { Icon } from '@iconify/react';
import { Link } from '~/Components/Link/Link';
import { SultenPage } from '~/Components/SultenPage';
import { TextItem } from '~/constants/TextItems';
import { useTextItem } from '~/hooks';
import styles from './LycheContactPage.module.scss';
export function LycheContactPage() {
  const contactCard = (
    <div className={styles.contactContainer}>
      <div className={styles.textContainer}>
        <p className={styles.lycheContactText}>{useTextItem(TextItem.sulten_contact_page_text)}</p>
        <p className={styles.contactAddress}>booking-lyche@uka.no</p>
        <p className={styles.contactAddress}>Elgesetergate 1</p>
        <div className={styles.lycheSocialsContainer}>
          <Link target="external" url="https://www.facebook.com/samfundet.lyche">
            <Icon className={styles.icon} color="white" icon="bi:facebook" width={40} />
          </Link>
          <Link target="external" url="https://www.instagram.com/lychekjokkenogbar/">
            <Icon className={styles.icon} color="white" icon="bi:instagram" width={40} />
          </Link>
          <Link target="external" url="https://maps.app.goo.gl/z98jeRNVqQUPRWsv9">
            <Icon className={styles.icon} color="white" icon="carbon:map" width={40} />
          </Link>
        </div>
      </div>

      <div className={styles.lycheMapContainer}>
        <iframe
          className={styles.lycheStreet}
          // eslint-disable-next-line max-len
          src="https://www.google.com/maps/embed?pb=!4v1696369072803!6m8!1m7!1s2XEhTJwM_No8aTTrqI72RQ!2m2!1d63
          .42220330892942!2d10.3953201100997!3f352.98823313957973!4f2.236618333891684!5f0.7820865974627469"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
  return (
    <>
      <SultenPage>
        <div className={styles.container}>{contactCard}</div>
      </SultenPage>
    </>
  );
}
