import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuthContext } from '~/AuthContext';
import { Alert, Page } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { getUser, register } from '~/api';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './SignUpPage.module.scss';

export function SignUpPage() {
  const { t } = useTranslation();
  const [loginFailed, setLoginFailed] = useState(false);
  const { user, setUser } = useAuthContext();
  const navigate = useCustomNavigate();

  useEffect(() => {
    if (user !== undefined) {
      navigate({ url: ROUTES.frontend.home });
    }
  }, [user, navigate]);

  function handleRegistration(formData: Record<string, string>) {
    register(formData['username'], formData['firstname'], formData['lastname'], formData['password'])
      .then((status) => {
        if (status === STATUS.HTTP_202_ACCEPTED) {
          getUser().then((user) => {
            setUser(user);
          });

          navigate({ url: ROUTES.frontend.home });
        } else {
          setLoginFailed(true);
        }
      })
      .catch((error) => {
        setLoginFailed(true);
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  return (
    <Page>
      <div className={styles.login_container}>
        {loginFailed && (
          <Alert
            message="Login failed"
            type="error"
            align="center"
            closable={true}
            onClose={() => {
              setLoginFailed(false);
            }}
          ></Alert>
        )}
        <div className={styles.content_container}>
          <SamfForm onSubmit={handleRegistration} submitText={t(KEY.common_register) ?? ''}>
            <h1 className={styles.header_text}>{t(KEY.loginpage_register)}</h1>
            <SamfFormField
              required={true}
              field="username"
              type="text"
              label={t(KEY.loginpage_email_placeholder) ?? ''}
            />
            <SamfFormField required={true} field="firstname" type="text" label={t(KEY.common_firstname) ?? ''} />
            <SamfFormField required={true} field="lastname" type="text" label={t(KEY.common_lastname) ?? ''} />
            <SamfFormField required={true} field="password" type="password" label={t(KEY.common_password) ?? ''} />
            <SamfFormField
              required={true}
              field="password_repeat"
              type="password"
              label={t(KEY.common_repeat) + ' ' + t(KEY.common_password) ?? ''}
            />
          </SamfForm>
        </div>
      </div>
    </Page>
  );
}
