import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '~/Components';
import { Page } from '~/Components/Page';
import { getInformationPage } from '~/api';
import type { InformationPageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { SamfMarkdown } from '~/Components/SamfMarkdown';
import { useAuthContext } from '~/context/AuthContext';
import { STATUS } from '~/http_status_codes';
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
  const [page, setPage] = useState<InformationPageDto>();
  const { slugField } = useParams();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  // Fetch page data
  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  useEffect(() => {
    if (slugField) {
      getInformationPage(slugField)
        .then((data) => {
          setPage(data);
          setShowSpinner(false);
        })
        .catch((error) => {
          if (error.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.not_found, { replace: true });
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
          setShowSpinner(false);
        });
    }
  }, [navigate, slugField]);

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
    <Page className={styles.wrapper} loading={showSpinner}>
      {canEditPage && (
        <>
          <Button rounded={true} theme="blue" onClick={() => navigate(editUrl)}>
            <Icon icon="mdi:pencil" />
            {lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.information_page_short)}`)}
          </Button>
          <br />
        </>
      )}
      <SamfMarkdown>{`# ${title} \n ${text}`}</SamfMarkdown>
    </Page>
  );
}
