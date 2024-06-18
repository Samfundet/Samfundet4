import { RecruitmentApplicationDto } from '~/dto';

/** Filtrer recruitmentApplication based on positionId, InterviewId and interview time */
export function filterRecruitmentApplication(
  recruitmentApplications: RecruitmentApplicationDto[],
  positionId: string,
  interviewId: string,
): RecruitmentApplicationDto[] {
  return recruitmentApplications.filter(
    (admission) =>
      admission.recruitment_position &&
      admission.recruitment_position.toString() === positionId &&
      admission.interview?.id.toString() === interviewId &&
      admission.interview?.interview_time !== null,
  );
}

export function getNameUser(admission: RecruitmentApplicationDto): string {
  return admission.user.first_name ? admission.user.first_name + ' ' + admission.user.last_name : '';
}
