import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import { LastUpdatedByHeader, Link } from '~/Components';
import { useGetAdminInfoPage } from '~/domain';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { InformationPageForm } from './components';

export function InformationFormAdminPage() {
  const { t } = useTranslation();

  const navigate = useCustomNavigate();
  const { slugField } = useParams();

  const title = lowerCapitalize(
    slugField
      ? `${t(KEY.common_edit)} ${t(KEY.information_page)}`
      : `${t(KEY.common_create)} ${t(KEY.information_page_short)}`,
  );
  useTitle(title);

  const { data: infoPageData, isLoading: infoPageLoading } = useGetAdminInfoPage(slugField ?? '');

  const header = infoPageData && (
    <div>
      <LastUpdatedByHeader model={infoPageData} />
      <div>
        <Link
          url={reverse({
            pattern: ROUTES.frontend.admin_information_history,
            urlParams: { slugField: infoPageData.slug_field },
          })}
        >
          {lowerCapitalize(`${t(KEY.common_show)} ${t(KEY.admin_information_history_title)}`)}
        </Link>
      </div>
    </div>
  );

  if (slugField && !infoPageLoading && !infoPageData) {
    return <Navigate to={ROUTES.frontend.admin_information} replace />;
  }

  return (
    <AdminPageLayout title={title} loading={infoPageLoading} header={header}>
      {!infoPageLoading && (
        <InformationPageForm
          infoPage={infoPageData}
          onSuccess={(data) => {
            if (!slugField) {
              navigate({
                url: reverse({
                  pattern: ROUTES.frontend.information_page_detail,
                  urlParams: { slugField: data.slug_field },
                }),
              });
            }
          }}
        />
      )}
    </AdminPageLayout>
  );
}
