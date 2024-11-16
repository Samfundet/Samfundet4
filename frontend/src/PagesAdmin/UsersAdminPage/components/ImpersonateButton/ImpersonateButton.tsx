import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/Components';
import { impersonateUser } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import { KEY } from '~/i18n/constants';
import styles from './ImpersonateButton.module.scss';

type Props = {
  userId: number;
};

export function ImpersonateButton({ userId }: Props) {
  const { t } = useTranslation();
  const { user } = useAuthContext();

  function impersonate() {
    impersonateUser(userId)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  }

  return (
    <Button
      type="button"
      theme="black"
      title={t(KEY.admin_impersonate)}
      onClick={impersonate}
      disabled={userId === user?.id}
      className={styles.button}
    >
      <Icon icon="ri:spy-fill" inline={true} />
    </Button>
  );
}
