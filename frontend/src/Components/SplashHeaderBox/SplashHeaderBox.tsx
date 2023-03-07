import { Icon } from '@iconify/react';
import classnames from 'classnames';
import { useAuthContext } from '~/AuthContext';
import { useGlobalContext } from '~/GlobalContextProvider';
import { useScrollY } from '~/hooks';
import styles from './SplashHeaderBox.module.scss';

type SplashHeaderBoxProps = {
};

export function SplashHeaderBox({  }: SplashHeaderBoxProps) {
  const { switchTheme, theme } = useGlobalContext();
  const { user } = useAuthContext();

  const scrollY = useScrollY();

  const containerScrollSpeed = -0.1;
  const containerTranslation = scrollY * containerScrollSpeed;
  const containerStyle = {
    transform: "translateY(" + containerTranslation + "px)"
  }
  
  return (
    <div className={styles.container} style={containerStyle}>
        <div className={classnames(styles.box, styles.box_left)}>
          <h2 className={styles.title_left}>
            <Icon icon="bx:party"/>
            Hva skjer?
          </h2>
          <p>10:13 - Some weird event</p>
          <p>10:13 - Some weird event</p>
          <p>10:13 - Some weird event</p>
          <p>10:13 - Some weird event</p>
          <p>10:13 - Some weird event</p>
        </div>
        <div className={classnames(styles.box, styles.box_right)}>
          <h2 className={styles.title_right}>
            <Icon icon="material-symbols:calendar-month-rounded"/>
            Åpningstider
          </h2>
          <p>10:13 - Some weird event</p>
          <p>10:13 - Some weird event</p>
          <p>10:13 - Some weird event</p>
          <p>10:13 - Some weird event</p>
          <p>10:13 - Some weird event</p>
        </div>
    </div>
  );
}
