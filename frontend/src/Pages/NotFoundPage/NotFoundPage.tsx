import { useTranslation } from 'react-i18next';
import { Button, Link } from '~/Components';
import { NotFound } from '~/assets';
import { SUPPORT_EMAIL } from '~/constants';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './NotFoundPage.module.scss';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCustomNavigate, useTitle } from '~/hooks';

export function NotFoundPage() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useCustomNavigate();

  // Hack for recruitment-only mode
  useEffect(() => {
    if (pathname === ROUTES.frontend.home) {
      navigate({ url: ROUTES.frontend.recruitment });
    }
  }, [navigate, pathname]);

  useTitle(t(KEY.notfoundpage_title));
  return (
    <div className={styles.container}>
      <img src={NotFound} className={styles.image} />
      <br></br>
      <Button rounded={true} theme="outlined" link={ROUTES.frontend.home}>
        <span className={styles.button_text}>{t(KEY.common_back_to_samfundet)}</span>
      </Button>
      <br></br>
      <i className={styles.text}>
        {t(KEY.notfoundpage_contact_prompt)}{' '}
        <Link url={`mailto:${SUPPORT_EMAIL}`} target="email">
          {t(KEY.common_contact_us).toLowerCase()}
        </Link>
        .
      </i>
    </div>
  );
}
