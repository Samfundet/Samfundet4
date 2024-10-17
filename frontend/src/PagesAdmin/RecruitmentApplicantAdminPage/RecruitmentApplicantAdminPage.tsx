import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BackButton, Button, FormControl, FormField, FormItem, FormLabel, FormMessage, Link, Page, SamfundetLogoSpinner, Textarea, TextAreaField } from '~/Components';
import { Table } from '~/Components/Table';
import { Text } from '~/Components/Text/Text';
import { getRecruitmentApplicationsForRecruiter, withdrawRecruitmentApplicationRecruiter } from '~/api';
import type { InterviewDto, RecruitmentApplicationDto, } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentApplicantAdminPage.module.scss';
import { useMutation, useQuery } from '@tanstack/react-query';
import { RecruitmentInterviewNotesForm } from './RecruitmentInterviewNotesForm';



export function RecruitmentApplicantAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { applicationID } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['recruitmentapplicationpage', applicationID],
    queryFn: () => getRecruitmentApplicationsForRecruiter(applicationID as string),
  });

  if (error) {
    if (data?.request.status === STATUS.HTTP_404_NOT_FOUND) {
      navigate(ROUTES.frontend.not_found, { replace: true });
    }
    toast.error(t(KEY.common_something_went_wrong));
  }

  const recruitmentApplication = data?.data.application;
  const applicant = data?.data.user;
  const otherRecruitmentApplication = data?.data.other_applications;
  const interviewNotes = recruitmentApplication?.interview?.notes;

    const adminWithdraw = useMutation({
    mutationFn: (id: string) => {
      return withdrawRecruitmentApplicationRecruiter(id);
    },
    onSuccess: () => {
      // TODO: make better response
      toast.success(t(KEY.common_update_successful));
    }
  });


  function handleUpdateNotes(value: string) {
    const updatedNotes = value;
    if (recruitmentApplication?.id) {
      // TODO update notes
    }
  }

  if (isLoading) {
    return (
      <div>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  const initialData: Partial<InterviewDto> = {
    notes: interviewNotes || '',
  }; 

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
        <Text>{recruitmentApplication?.application_text}</Text>
      </div>
      <div className={classNames(styles.infoContainer)}>
      <RecruitmentInterviewNotesForm
        initialData={initialData}
      />
      
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

          data={otherRecruitmentApplication ? otherRecruitmentApplication.map((element) => {
            return [
              {
                sortable: true,
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
                    {element.applicant_priority}
                  </Link>
                ),
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
            ];
          }) :[]}
          
        />
      </div>
      <div className={styles.withdrawContainer}>
        {recruitmentApplication?.withdrawn ? (
          <Text as="i" size="l" className={styles.withdrawnText}>
            {t(KEY.recruitment_withdrawn)}
          </Text>
        ) : (
          <Button theme="samf" onClick={ () => {
            if (recruitmentApplication?.id) {
              adminWithdraw.mutate(recruitmentApplication.id)}}}>
            {t(KEY.recruitment_withdraw_application)}
          </Button>
        )}
      </div>
    </Page>
  );
}
