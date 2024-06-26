import { Icon } from '@iconify/react';
import { useAuthContext } from '~/context/AuthContext';
import { Button, ToggleSwitch } from '~/Components';
import { Page } from '~/Components/Page';
import { useGlobalContext } from '~/context/GlobalContextProvider';
import styles from './AdminPage.module.scss';
import { WISEWORDS } from './data';
import { ROUTES } from '~/routes';
import { Link } from 'react-router-dom';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { getRandomEntryFromList } from '~/utils';
import { useTitle } from '~/hooks';

export function AdminPage() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  useTitle(t(KEY.command_menu_shortcut_control_panel));

  const WISEWORD = getRandomEntryFromList(WISEWORDS) as string;

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
        <br />
        <br />
        <Link to={ROUTES.frontend.admin_impersonate}>
          <Button>{t(KEY.admin_steal_identity)}</Button>
        </Link>
      </div>
    </Page>
  );
}
