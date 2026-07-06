import { useTranslation } from 'react-i18next';
import { ImageForm } from '~/Components';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ImageFormAdminPage.module.scss';

type FormType = {
  title: string;
  tag_string: string;
  file: File;
};

export function ImageFormAdminPage() {
  const navigate = useCustomNavigate();
  const { t } = useTranslation();

  const title = t(KEY.admin_images_create);
  useTitle(title);

  return (
    <AdminPageLayout title={title}>
      <div className={styles.form_wrapper}>
        <ImageForm />
      </div>
    </AdminPageLayout>
  );
}
