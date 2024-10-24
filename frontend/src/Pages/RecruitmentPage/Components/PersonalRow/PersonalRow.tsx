import { t } from 'i18next';
import { Button } from '~/Components';
import { useAuthContext } from '~/context/AuthContext';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';

type PersonalRowProps = {
  recruitmentId: string;
  organizationName: string;
  showRecruitmentBtn?: boolean;
};

export function PersonalRow({ recruitmentId, organizationName, showRecruitmentBtn = true }: PersonalRowProps) {
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
                urlParams: { recruitmentId },
              }),
            });
          }}
        >
          {`${t(KEY.recruitment_apply_for)} ${organizationName ?? 'N/A'}`}
        </Button>
      )}
      {user ? (
        <Button
          theme="samf"
          onClick={() => {
            navigate({
              url: reverse({
                pattern: ROUTES.frontend.recruitment_application_overview,
                urlParams: { recruitmentId },
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
