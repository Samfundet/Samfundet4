import { useTranslation } from 'react-i18next';
import { WISEWORDS } from '~/Pages/AdminHomePage/data';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { getRandomEntryFromList } from '~/utils';
import styles from './AdminHomePage.module.scss';

export function AdminHomePage() {
  const { t } = useTranslation();
  const title = t(KEY.command_menu_shortcut_control_panel);
  useTitle(title);

  const WISEWORD = getRandomEntryFromList(WISEWORDS) as string;

  return (
    <AdminPageLayout title={title} thin>
      <p className={styles.wisewords}>{WISEWORD}</p>
      todo dashboard
    </AdminPageLayout>
  );
}
