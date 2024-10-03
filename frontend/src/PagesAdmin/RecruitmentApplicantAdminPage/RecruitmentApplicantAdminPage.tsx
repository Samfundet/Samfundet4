import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BackButton, Button, Link, Page, SamfundetLogoSpinner } from '~/Components';
import { Table } from '~/Components/Table';
import { Text } from '~/Components/Text/Text';
import { getRecruitmentApplicationsForRecruiter, withdrawRecruitmentApplicationRecruiter } from '~/api';
import type { RecruitmentApplicationDto, RecruitmentUserDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentApplicantAdminPage.module.scss';

export function RecruitmentApplicantAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [recruitmentApplication, setRecruitmentApplication] = useState<RecruitmentApplicationDto>();
  const [otherRecruitmentApplication, setOtherRecruitmentApplication] = useState<RecruitmentApplicationDto[]>([]);
  const [applicant, setApplicant] = useState<RecruitmentUserDto>();

  const [loading, setLoading] = useState(true);

  const { applicationID } = useParams();

  useEffect(() => {
    getRecruitmentApplicationsForRecruiter(applicationID as string)
      .then((res) => {
        setRecruitmentApplication(res.data.application);
        setApplicant(res.data.user);
        setOtherRecruitmentApplication(res.data.other_applications);
        setLoading(false);
      })
      .catch((data) => {
        if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
          navigate(ROUTES.frontend.not_found, { replace: true });
        }
        toast.error(t(KEY.common_something_went_wrong));
      });
  }, [applicationID, t, navigate]);

  const adminWithdraw = () => {
    if (recruitmentApplication) {
      withdrawRecruitmentApplicationRecruiter(recruitmentApplication.id)
        .then((response) => {
          setRecruitmentApplication(response.data);
          toast.success(t(KEY.common_update_successful));
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
  };

  if (loading) {
    return (
      <div>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return (
    <Page>
      <div className={classNames(styles.infoContainer)}>
        <BackButton />
        <Text size="l" as="strong" className={styles.textBottom}>
          {applicant?.first_name} {applicant?.last_name}
        </Text>
        <Table
          data={[
            {
              cells: [
                t(KEY.common_phonenumber),
                applicant?.phone_number ? applicant?.phone_number : t(KEY.common_not_set),
              ],
            },
            { cells: [t(KEY.common_email), applicant?.email ? applicant?.email : t(KEY.common_not_set)] },
            {
              cells: [t(KEY.common_campus), applicant?.campus ? dbT(applicant?.campus, 'name') : t(KEY.common_not_set)],
            },
          ]}
        />
      </div>
      <div className={classNames(styles.infoContainer)}>
        <Text size="l" as="strong" className={styles.textBottom}>
          {t(KEY.recruitment_application)}: {dbT(recruitmentApplication?.recruitment_position, 'name')}
        </Text>
        <Text>{recruitmentApplication?.application_text}</Text>
      </div>
      <div className={styles.withdrawContainer}>
        {recruitmentApplication?.withdrawn ? (
          <Text as="i" size="l" className={styles.withdrawnText}>
            {t(KEY.recruitment_withdrawn)}
          </Text>
        ) : (
          <Button theme="samf" onClick={adminWithdraw}>
            {t(KEY.recruitment_withdraw_application)}
          </Button>
        )}
      </div>
      <div className={classNames(styles.infoContainer)}>
        <Text size="l" as="strong" className={styles.textBottom}>
          {t(KEY.recruitment_all_applications)}
        </Text>
        <Table
          columns={[
            '#',
            t(KEY.common_recruitmentposition),
            t(KEY.common_gang),
            t(KEY.recruitment_recruiter_status),
            t(KEY.recruitment_interview_time),
          ]}
          data={otherRecruitmentApplication.map((element) => {
            return {
              cells: [
                {
                  sortable: true,
                  content: element.applicant_priority,
                },
                {
                  content: (
                    <Link
                      target={'frontend'}
                      url={reverse({
                        pattern: ROUTES.frontend.admin_recruitment_applicant,
                        urlParams: {
                          applicationID: element.id,
                        },
                      })}
                    >
                      {dbT(element.recruitment_position, 'name')}
                    </Link>
                  ),
                },
                {
                  content: (
                    <Link
                      url={reverse({
                        pattern: ROUTES.frontend.information_page_detail,
                        urlParams: { slugField: element.recruitment_position.gang.name_nb.toLowerCase() },
                      })}
                    >
                      {dbT(element.recruitment_position.gang, 'name')}
                    </Link>
                  ),
                },
                element.recruiter_priority ? element.recruiter_priority : t(KEY.common_not_set),
                element.interview_time ? element.interview_time : t(KEY.common_not_set),
              ],
            };
          })}
        />
      </div>
    </Page>
  );
}
