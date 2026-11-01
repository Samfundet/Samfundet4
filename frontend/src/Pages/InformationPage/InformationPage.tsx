import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, H1 } from '~/Components';
import { Page } from '~/Components/Page';
import { is404, useGetInfoPage } from '~/domain';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { SamfMarkdown } from '~/Components/SamfMarkdown';
import { useAuthContext } from '~/context/AuthContext';
import { PERM } from '~/permissions';
import { dbT, hasPerm, lowerCapitalize } from '~/utils';
import styles from './InformationPage.module.scss';

/**
 * Renders information page using markdown
 */
export function InformationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { user } = useAuthContext();
  const { slugField } = useParams();
  const { data: page, isLoading, error } = useGetInfoPage(slugField);

  // Other errors are toasted by the global QueryCache handler
  useEffect(() => {
    if (is404(error)) {
      navigate(ROUTES.frontend.not_found, { replace: true });
    }
  }, [error, navigate]);

  // Text and title
  const text = dbT(page, 'text') ?? '';
  const title = dbT(page, 'title') ?? '';

  // Editing
  const editUrl = reverse({
    pattern: ROUTES.frontend.admin_information_edit,
    urlParams: { slugField: page?.slug_field },
  });
  const canEditPage = hasPerm({ user: user, permission: PERM.SAMFUNDET_CHANGE_INFORMATIONPAGE, obj: page?.slug_field });

  return (
    <Page className={styles.wrapper} loading={isLoading}>
      {canEditPage && (
        <>
          <Button rounded={true} theme="blue" onClick={() => navigate(editUrl)}>
            <Icon icon="mdi:pencil" />
            {lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.information_page_short)}`)}
          </Button>
          <br />
        </>
      )}
      <H1>{title}</H1>
      <SamfMarkdown markdown={text} />
    </Page>
  );
}
