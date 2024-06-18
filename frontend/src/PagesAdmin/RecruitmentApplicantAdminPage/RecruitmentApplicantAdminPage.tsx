import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BackButton, Link, Page, SamfundetLogoSpinner } from '~/Components';
import { getRecruitmentApplicationsForRecruiter } from '~/api';
import { RecruitmentApplicationDto, RecruitmentUserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentApplicantAdminPage.module.scss';
import { Text } from '~/Components/Text/Text';
import { Table } from '~/Components/Table';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';

export function RecruitmentApplicantAdminPage() {
  const { t } = useTranslation();

  const [recruitmentApplication, setRecruitmentApplication] = useState<RecruitmentApplicationDto>();
  const [otherRecruitmentApplication, setOtherRecruitmentApplication] = useState<RecruitmentApplicationDto[]>([]);
  const [applicant, setApplicant] = useState<RecruitmentUserDto>();

  const [loading, setLoading] = useState(true);

  const { admissionID } = useParams();

  useEffect(() => {
    getRecruitmentApplicationsForRecruiter(admissionID as string)
      .then((res) => {
        setRecruitmentApplication(res.data.admission);
        setApplicant(res.data.user);
        setOtherRecruitmentApplication(res.data.other_admissions);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }, [admissionID, t]);

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
            [t(KEY.common_phonenumber), applicant?.phone_number ? applicant?.phone_number : t(KEY.common_not_set)],
            [t(KEY.common_email), applicant?.email ? applicant?.email : t(KEY.common_not_set)],
            [t(KEY.common_campus), applicant?.campus ? dbT(applicant?.campus, 'name') : t(KEY.common_not_set)],
          ]}
        />
      </div>
      <div className={classNames(styles.infoContainer)}>
        <Text size="l" as="strong" className={styles.textBottom}>
          {t(KEY.recruitment_application)}: {dbT(recruitmentApplication?.recruitment_position, 'name')}
        </Text>
        <Text>{recruitmentApplication?.admission_text}</Text>
      </div>
      <div className={classNames(styles.infoContainer)}>
        <Text size="l" as="strong" className={styles.textBottom}>
          {t(KEY.recruitment_all_applications)}
        </Text>
        <Table
          columns={[
            t(KEY.common_recruitmentposition),
            t(KEY.common_gang),
            t(KEY.recruitment_recruiter_status),
            t(KEY.recruitment_interview_time),
          ]}
          data={otherRecruitmentApplication.map(function (element) {
            return [
              {
                content: (
                  <Link
                    target={'frontend'}
                    url={reverse({
                      pattern: ROUTES.frontend.admin_recruitment_applicant,
                      urlParams: {
                        admissionID: element.id,
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
            ];
          })}
        />
      </div>
    </Page>
  );
}
