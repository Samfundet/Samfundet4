import { hasPerm } from '~/utils';
import { Button } from '~/Components';
import { Page } from '~/Components/Page';
import { useAuthContext } from '~/AuthContext';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { applets } from './applets';
import styles from './AdminPage.module.scss';
import { AdminBox } from '~/Components/AdminBox';
import { WISEWORDS } from './data';

export function AdminPage() {
  const { user } = useAuthContext();
  const { t } = useTranslation();
  const WISEWORD = WISEWORDS[Math.floor(Math.random() * WISEWORDS.length)];

  return (
    <Page>
      <div className={styles.header}>
        <h1 className={styles.headerText}>{t(KEY.control_panel_title)}</h1>
        <p className={styles.wisewords}>{WISEWORD}</p>
        <Button theme="outlined" className={styles.faq_button}>
          <p className={styles.faq_text}>{t(KEY.control_panel_faq)}</p>
        </Button>
      </div>
      <div className={styles.applets}>
        {applets.map(function (element, key) {
          if (element.perm == null || hasPerm({ user: user, permission: element.perm })) {
            return <AdminBox key={key} title={element.title} options={element.options} />;
          }
        })}
      </div>
    </Page>
  );
}
