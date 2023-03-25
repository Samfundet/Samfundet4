import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '~/AuthContext';
import { Button } from '~/Components';
import { AdminBox } from '~/Components/AdminBox';
import { Page } from '~/Components/Page';
import { useToastContext } from '~/Components/ToastManager/ToastManager';
import { KEY } from '~/i18n/constants';
import { hasPerm } from '~/utils';
import styles from './AdminPage.module.scss';
import { applets } from './applets';
import { WISEWORDS } from './data';

export function AdminPage() {
  const { user } = useAuthContext();
  const { t } = useTranslation();
  const [WISEWORD, _] = useState<string>(WISEWORDS[Math.floor(Math.random() * WISEWORDS.length)]);

  const { pushToast, popToast } = useToastContext();

  return (
    <Page>
      <Button
        onClick={() => {
          console.log('Push toast');
          pushToast({
            title: 'Her er en test-toast',
            message: 'Lorem ipsum dolor sit amet, noe annet kult. Heisann hoppsan.',
            closable: true,
            delay: 5000,
          });
        }}
      >
        Test
      </Button>
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
        {applets.map(function (element, key) {
          if (!element.perm || hasPerm({ user: user, permission: element.perm })) {
            return <AdminBox key={key} title={element.title} icon={element.icon} options={element.options} />;
          }
        })}
      </div>
    </Page>
  );
}
