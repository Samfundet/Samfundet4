import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Page } from '~/Components/Page';
import { useAuthContext } from '~/context/AuthContext';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { getRandomEntryFromList } from '~/utils';
import styles from './AdminPage.module.scss';
import { WISEWORDS } from './data';

export function AdminPage() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  useTitle(t(KEY.command_menu_shortcut_control_panel));

  const WISEWORD = getRandomEntryFromList(WISEWORDS) as string;

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
      </div>
    </Page>
  );
}
