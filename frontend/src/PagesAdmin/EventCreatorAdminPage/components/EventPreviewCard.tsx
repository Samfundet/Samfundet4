import { useTranslation } from 'react-i18next';
import { ImageCard } from '~/Components';
import { BACKEND_DOMAIN } from '~/constants';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from '../EventCreatorAdminPage.module.scss';
import type { FormType } from '../hooks/useEventCreatorForm';

export function EventPreviewCard({ values }: { values: FormType }) {
  const { t } = useTranslation();
  return (
    <div className={styles.preview}>
      <ImageCard
        title={dbT(values, 'title') ?? ''}
        description={dbT(values, 'description_short') ?? ''}
        imageUrl={values.image?.url ? BACKEND_DOMAIN + values.image.url : ''}
        date={values.start_dt ?? ''}
        ticket_type={values.ticket_type}
        host={values.host}
      />
      {/* Preview Info */}
      <div className={styles.previewText}>
        <span>
          <b>{t(KEY.category)}:</b> {values.category ?? t(KEY.common_missing)}
        </span>
        <span>
          <strong>{t(KEY.recruitment_duration)}:</strong>{' '}
          {values.duration ? `${values.duration} min` : t(KEY.common_missing)}
        </span>
        <span>
          <b>{t(KEY.admin_organizer)}:</b> {values.host ?? t(KEY.common_missing)}
        </span>
        <span>
          <b>{t(KEY.common_venue)}:</b> {values.location ?? t(KEY.common_missing)}
        </span>
      </div>
    </div>
  );
}
