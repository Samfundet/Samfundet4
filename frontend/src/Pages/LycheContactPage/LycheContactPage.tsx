import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { SultenPage } from '~/Components/SultenPage';
import styles from './LycheContactPage.module.scss';
import { Image } from '~/Components';
import { kitteh } from '~/assets';
import { Icon } from '@iconify/react';

export function LycheContactPage() {
  const contactCard = (
    <div className={styles.contactContainer}>
      <p className={styles.contactAddress}> HALLO !!!!</p>
      <p className={styles.contactEmail}> HVOR ER JEG !!!!</p>
      <div className={styles.contactSocials}>
        <Icon icon="ph:instagram-logo-light" className={styles.icon} />
        <iframe
          className={styles.lycheMap}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d446.
          272564853638!2d10.395138412303172!3d63.42227609031181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.
          1!3m3!1m2!1s0x466d31915ab2a009%3A0xd6ae74039e2b8871!2sLyche%20Kj%C3%B8kken%20%26%20Bar
          !5e0!3m2!1sno!2sno!4v1695923302609!5m2!1sno!2sno"
          // width="600"
          // height="450"
        ></iframe>
      </div>
    </div>
  );
  return (
    <>
      <SultenPage>
        <div className={styles.outerContainer}>
          <div className={styles.innerContainer}>
            {/* <Image src={kitteh}></Image> */}
            {contactCard}
          </div>
        </div>
      </SultenPage>
    </>
  );
}
