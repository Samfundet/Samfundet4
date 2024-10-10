import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { H3 } from '~/Components';
import { AppletCard } from '~/PagesAdmin/RecruitmentGangOverviewPage/Components';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import styles from './AppletContainer.module.scss';

type AppletCategory = {
  label: string;
  value: ReactNode;
};

type Props = {
  recruitmentId: string | undefined;
};

export function AppletContainer({ recruitmentId }: Props) {
  const { t } = useTranslation();

  const appletCategories: Record<string, AppletCategory> = {
    personal: {
      label: t(KEY.common_personal),
      value: (
        <>
          <AppletCard
            title={t(KEY.recruitment_recruiter_dashboard)}
            description={t(KEY.recruitment_applet_dashboard_description)}
            url={reverse({
              pattern: ROUTES.frontend.admin_recruitment_recruiter_dashboard,
              urlParams: { recruitmentId },
            })}
          />
        </>
      ),
    },
    admin: {
      label: t(KEY.common_administration),
      value: (
        <>
          <AppletCard
            title={t(KEY.common_edit)}
            description={t(KEY.recruitment_applet_edit_description)}
            url={reverse({ pattern: ROUTES.frontend.admin_recruitment_edit, urlParams: { recruitmentId } })}
          />

          <AppletCard
            title={t(KEY.common_overview)}
            description={t(KEY.recruitment_applet_overview_description)}
            url={reverse({ pattern: ROUTES.frontend.admin_recruitment_overview, urlParams: { recruitmentId } })}
          />

          <AppletCard
            title={t(KEY.common_room)}
            description={t(KEY.recruitment_applet_room_description)}
            url={reverse({
              pattern: ROUTES.frontend.admin_recruitment_room_overview,
              urlParams: { recruitmentId },
            })}
          />

          <AppletCard
            title={t(KEY.recruitment_separate_recruitment)}
            description={lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.recruitment_gangs_with_separate_positions)}`)}
            url={reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_separateposition_create,
              urlParams: { recruitmentId },
            })}
          />

          <AppletCard
            title={lowerCapitalize(t(KEY.recruitment_rejection_email))}
            description={t(KEY.recruitment_applet_rejection_mail_description)}
            url="#"
            disabled={true}
          />
        </>
      ),
    },
    applicants: {
      label: t(KEY.recruitment_applicants),
      value: (
        <>
          <AppletCard
            title={t(KEY.common_unprocessed)}
            description={t(KEY.recruitment_show_unprocessed_applicants)}
            url={reverse({
              pattern: ROUTES.frontend.admin_recruitment_show_unprocessed_applicants,
              urlParams: { recruitmentId: recruitmentId },
            })}
          />

          <AppletCard
            title={t(KEY.recruitment_applet_without_interview_title)}
            description={t(KEY.recruitment_applet_without_interview_description)}
            url={reverse({
              pattern: ROUTES.frontend.admin_recruitment_users_without_interview,
              urlParams: { recruitmentId },
            })}
          />

          <AppletCard
            title={t(KEY.recruitment_applet_three_interview_title)}
            description={t(KEY.recruitment_three_interviews_criteria_button)}
            url={reverse({
              pattern: ROUTES.frontend.admin_recruitment_users_three_interview_criteria,
              urlParams: { recruitmentId: recruitmentId },
            })}
          />
        </>
      ),
    },
  };

  return (
    <div className={styles.container}>
      {Object.entries(appletCategories).map(([key, applet]) => (
        <div key={key}>
          <H3>{applet.label}</H3>
          <div className={styles.applets}>{applet.value}</div>
        </div>
      ))}
    </div>
  );
}
