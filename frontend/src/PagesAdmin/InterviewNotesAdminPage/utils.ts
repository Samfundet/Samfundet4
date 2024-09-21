import type { RecruitmentApplicationDto } from '~/dto';

/** Filtrer recruitmentApplication based on positionId, InterviewId and interview time */
export function filterRecruitmentApplication(
  recruitmentApplications: RecruitmentApplicationDto[],
  positionId: string,
  interviewId: string,
): RecruitmentApplicationDto[] {
  return recruitmentApplications.filter(
    (application) =>
      application.recruitment_position &&
      application.recruitment_position.toString() === positionId &&
      application.interview?.id?.toString() === interviewId &&
      application.interview?.interview_time !== null,
  );
}

export function getNameUser(application: RecruitmentApplicationDto): string {
  return application.user.first_name ? `${application.user.first_name} ${application.user.last_name}` : '';
}
