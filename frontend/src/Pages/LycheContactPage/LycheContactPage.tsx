import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './LycheContactPage.module.scss';
import { Image } from '~/Components';
import { kitteh } from '~/assets';

export function LycheContactPage() {
  const mapImage = <Image src={kitteh}></Image>;
  const;
  return (
    <>
      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}></div>
      </div>
    </>
  );
}
