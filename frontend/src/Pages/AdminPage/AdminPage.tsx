import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '~/AuthContext';
import { Button } from '~/Components';
import { AdminBox } from '~/Components/AdminBox';
import { Page } from '~/Components/Page';
import { KEY } from '~/i18n/constants';
import { hasPerm } from '~/utils';
import styles from './AdminPage.module.scss';
import { applets } from './applets';
import { WISEWORDS } from './data';

export function AdminPage() {
  const { user } = useAuthContext();
  const { t } = useTranslation();

  const randomWisewordIndex = Math.floor(Math.random() * WISEWORDS.length);
  const WISEWORD = WISEWORDS[randomWisewordIndex];

  return (
    <Page>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerText}>
            <Icon icon="ph:gear-fill" width={28} />
            {t(KEY.control_panel_title)}
          </h1>
          <p className={styles.wisewords}>{WISEWORD}</p>
        </div>

        <Button theme="outlined" rounded={true} className={styles.faq_button}>
          <p className={styles.faq_text}>{t(KEY.control_panel_faq)}</p>
        </Button>
      </div>

      <div className={styles.applets}>
        {applets.map((element, key) => {
          const hasPermOrPermNotNeeded = !element.perm || hasPerm({ user: user, permission: element.perm });
          return (
            hasPermOrPermNotNeeded && (
              <AdminBox key={key} title={element.title} icon={element.icon} options={element.options} />
            )
          );
        })}
      </div>
    </Page>
  );
}
