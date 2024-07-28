import { Button } from '~/Components';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { t } from 'i18next';
import { KEY } from '~/i18n/constants';
import { useCustomNavigate } from '~/hooks';
import { useAuthContext } from '~/context/AuthContext';

type PersonalRowProps = {
  recruitmentID: string;
  organizationName: string;
  showRecruitmentBtn?: boolean;
};

export function PersonalRow({ recruitmentID, organizationName, showRecruitmentBtn = true }: PersonalRowProps) {
  const navigate = useCustomNavigate();
  const { user } = useAuthContext();

  return (
    <>
      {showRecruitmentBtn && (
        <Button
          theme="green"
          onClick={() => {
            navigate({
              url: reverse({
                pattern: ROUTES.frontend.organization_recruitment,
                urlParams: { recruitmentID },
              }),
            });
          }}
        >
          {t(KEY.recruitment_open_position_at) + ' ' + (organizationName ?? 'N/A')}
        </Button>
      )}
      {user ? (
        <Button
          theme="samf"
          onClick={() => {
            navigate({
              url: reverse({
                pattern: ROUTES.frontend.recruitment_application_overview,
                urlParams: { recruitmentID },
              }),
            });
          }}
        >
          {t(KEY.recruitment_my_applications)}
        </Button>
      ) : (
        <Button
          theme="samf"
          onClick={() =>
            navigate({
              url: ROUTES.frontend.login,
            })
          }
        >
          {t(KEY.common_login)}
        </Button>
      )}
    </>
  );
}
