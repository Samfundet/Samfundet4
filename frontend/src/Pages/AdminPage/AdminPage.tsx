import { Icon } from '@iconify/react';
import { useAuthContext } from '~/AuthContext';
import { ToggleSwitch } from '~/Components';
import { Page } from '~/Components/Page';
import { useGlobalContext } from '~/GlobalContextProvider';
import styles from './AdminPage.module.scss';
import { WISEWORDS } from './data';

export function AdminPage() {
  const { user } = useAuthContext();

  const randomWisewordIndex = Math.floor(Math.random() * WISEWORDS.length);
  const WISEWORD = WISEWORDS[randomWisewordIndex];

  const { mirrorDimension, toggleMirrorDimension, isMouseTrail, toggleMouseTrail } = useGlobalContext();

  return (
    <Page>
      <div className={styles.container}>
        <div className={styles.header}>
          <Icon icon="mdi:person" />
          {user?.username}
          {user?.last_name}
        </div>
        <p className={styles.wisewords}>{WISEWORD}</p>
        {/* TODO make proper personal landing page with preferences etc */}
        <div className={styles.preferences_header}>Preferences</div>
        <div className={styles.preference_row}>
          <div className={styles.label}>Mirror Dimension</div>
          <ToggleSwitch checked={mirrorDimension} onChange={toggleMirrorDimension} />
        </div>
        <div className={styles.preference_row}>
          <div className={styles.label}>Mouse Trail</div>
          <ToggleSwitch checked={isMouseTrail} onChange={toggleMouseTrail} />
        </div>
      </div>
    </Page>
  );
}
