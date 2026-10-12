import { useTranslation } from 'react-i18next';
import { Button } from '~/Components';
import styles from './Section.module.scss';

export function Documents() {
  const { t, i18n } = useTranslation();

  const title = 'Your Case Documents';

  return (
    <section className={styles.section}>
      <div className={styles.row}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <Button>New</Button>
      </div>
    </section>
  );
}
