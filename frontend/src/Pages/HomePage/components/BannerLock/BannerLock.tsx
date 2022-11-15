import { kitteh } from '~/assets';
import styles from './BannerLock.module.scss';

export function BannerLock() {
  return (
    <div>
      <img className={styles.img} src={kitteh} alt="kitteh" />
    </div>
  );
}
