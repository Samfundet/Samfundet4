import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { NotFound } from '~/assets';
import { Button, Link } from '~/Components';
import { SUPPORT_EMAIL } from '~/constants';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './NotFoundPage.module.scss';

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <img src={NotFound} className={styles.image} />
      <br></br>
      <Button
        rounded={true}
        theme="outlined"
        onClick={() => {
          navigate(ROUTES.frontend.home);
        }}
      >
        <span className={styles.button_text}>{t(KEY.back_to_samfundet)}</span>
      </Button>
      <br></br>
      <i className={styles.text}>
        {t(KEY.not_found_contact_prompt)}{' '}
        <Link url={`mailto:${SUPPORT_EMAIL}`} target="email">
          {t(KEY.common_contact_us).toLowerCase()}
        </Link>
        .
      </i>
    </div>
  );
}
