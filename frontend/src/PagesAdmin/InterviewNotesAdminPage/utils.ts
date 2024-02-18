import { RecruitmentAdmissionDto } from '~/dto';

// Filtrer recruitmentadmission based on positionId, InterviewId and interview time
export function filterRecruitmentAdmission(
  recruitmentAdmissions: RecruitmentAdmissionDto[],
  positionId: string,
  interviewId: string,
): RecruitmentAdmissionDto[] {
  return recruitmentAdmissions.filter(
    (admission) =>
      admission.recruitment_position &&
      admission.recruitment_position.toString() === positionId &&
      admission.interview.id.toString() === interviewId &&
      admission.interview.interview_time !== null,
  );
}

export function getNameUser(admission: RecruitmentAdmissionDto): string {
  return admission.user.first_name ? admission.user.first_name + ' ' + admission.user.last_name : '';
}
