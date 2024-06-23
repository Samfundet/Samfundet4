import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Alert, Page } from '~/Components';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { validEmail, validPhonenumber } from '~/Forms/util';
import { getUser, register } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import type { RegistrationDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './SignUpPage.module.scss';

type SignUpFormData = {
  username: string;
  email: string;
  phone_number: string;
  firstname: string;
  lastname: string;
  password: string;
  password_repeat: string;
};

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

  function handleRegistration(formData: SignUpFormData) {
    register({ ...formData } as RegistrationDto)
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
            message="Register failed"
            type="error"
            align="center"
            closable={true}
            onClose={() => {
              setLoginFailed(false);
            }}
          />
        )}
        <div className={styles.content_container}>
          <SamfForm<RegistrationDto> onSubmit={handleRegistration} submitText={t(KEY.common_register) ?? ''}>
            <h1 className={styles.header_text}>{t(KEY.loginpage_register)}</h1>
            <SamfFormField<string, SignUpFormData>
              required={true}
              field="username"
              type="text"
              label={t(KEY.loginpage_username) ?? ''}
            />
            <SamfFormField<string, SignUpFormData>
              required={true}
              field="email"
              type="email"
              label={t(KEY.common_email) ?? ''}
              validator={(values) => validEmail(values.email)}
            />
            <SamfFormField<string, SignUpFormData>
              required={true}
              field="phone_number"
              type="phonenumber"
              label={t(KEY.common_phonenumber) ?? ''}
              validator={(values) => validPhonenumber(values.phone_number)}
            />
            <SamfFormField<string, SignUpFormData>
              required={true}
              field="firstname"
              type="text"
              label={t(KEY.common_firstname) ?? ''}
            />
            <SamfFormField<string, SignUpFormData>
              required={true}
              field="lastname"
              type="text"
              label={t(KEY.common_lastname) ?? ''}
            />
            <SamfFormField<string, SignUpFormData>
              required={true}
              field="password"
              type="password"
              label={t(KEY.common_password) ?? ''}
            />
            <SamfFormField<string, SignUpFormData>
              required={true}
              field="password_repeat"
              type="password"
              label={`${t(KEY.common_repeat)} ${t(KEY.common_password)}` ?? ''}
              validator={(values) => {
                return values.password === values.password_repeat ? true : t(KEY.loginpage_passwords_must_match);
              }}
            />
          </SamfForm>
        </div>
      </div>
    </Page>
  );
}
