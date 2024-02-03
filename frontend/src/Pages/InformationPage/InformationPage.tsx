import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInformationPage } from '~/api';
import { Button } from '~/Components';
import { Page } from '~/Components/Page';
import { InformationPageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { useAuthContext } from '~/AuthContext';
import { SamfMarkdown } from '~/Components/SamfMarkdown';
import { PERM } from '~/permissions';
import { dbT, hasPerm, lowerCapitalize } from '~/utils';
import styles from './InformationPage.module.scss';

/**
 * Renders information page using markdown
 */
export function InformationPage() {
  const navigate = useNavigate();

  const { user } = useAuthContext();
  const [page, setPage] = useState<InformationPageDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { slugField } = useParams();

  // Fetch page data
  useEffect(() => {
    if (slugField) {
      getInformationPage(slugField)
        .then((data) => {
          setPage(data);
          setShowSpinner(false);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
  }, [slugField]);

  // Text and title
  const text = dbT(page, 'text') ?? '';
  const title = dbT(page, 'title') ?? '';

  // Editing
  const editUrl = page
    ? reverse({
        pattern: ROUTES.frontend.admin_information_edit,
        urlParams: { slugField: page?.slug_field },
      })
    : '';
  const canEditPage = hasPerm({ user: user, permission: PERM.SAMFUNDET_CHANGE_INFORMATIONPAGE, obj: page?.slug_field });

  return (
    <Page className={styles.wrapper} loading={showSpinner}>
      {canEditPage && (
        <>
          <Button rounded={true} theme="blue" onClick={() => navigate(editUrl)}>
            <Icon icon="mdi:pencil" />
            {lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.information_page_short)}`)}
          </Button>
          <br></br>
        </>
      )}
      <SamfMarkdown>{`# ${title} \n ${text}`}</SamfMarkdown>
    </Page>
  );
}
