import i18next from 'i18next';
import { z } from 'zod';
import { KEY } from '~/i18n/constants';
import { LOCAL_DATETIME } from '~/schema/dates';

export const recruitmentSchema = z
  .object({
    name_nb: z.string().min(1),
    name_en: z.string().min(1),
    visible_from: LOCAL_DATETIME,
    shown_application_deadline: LOCAL_DATETIME,
    actual_application_deadline: LOCAL_DATETIME,
    reprioritization_deadline_for_applicant: LOCAL_DATETIME,
    reprioritization_deadline_for_groups: LOCAL_DATETIME,
    organization: z.number().min(1, { message: 'Organization is required' }),
    max_applications: z.number().nullish().optional(),
  })
  .refine(
    (data) => {
      const visibleFrom = new Date(data.visible_from);
      const shownApplicationDeadline = new Date(data.shown_application_deadline);
      return shownApplicationDeadline > visibleFrom;
    },
    {
      message: i18next.t(KEY.error_recruitment_form_1),
      path: ['shown_application_deadline'],
    },
  )
  .refine(
    (data) => {
      const shownApplicationDeadline = new Date(data.shown_application_deadline);
      const actualApplicationDeadline = new Date(data.actual_application_deadline);
      return actualApplicationDeadline > shownApplicationDeadline;
    },
    {
      message: i18next.t(KEY.error_recruitment_form_2),
      path: ['actual_application_deadline'],
    },
  )
  .refine(
    (data) => {
      const actualApplicationDeadline = new Date(data.actual_application_deadline);
      const reprioritizationDeadlineForApplicant = new Date(data.reprioritization_deadline_for_applicant);
      return reprioritizationDeadlineForApplicant > actualApplicationDeadline;
    },
    {
      message: i18next.t(KEY.error_recruitment_form_3),
      path: ['reprioritization_deadline_for_applicant'],
    },
  )
  .refine(
    (data) => {
      const reprioritizationDeadlineForApplicant = new Date(data.reprioritization_deadline_for_applicant);
      const reprioritizationDeadlineForGroups = new Date(data.reprioritization_deadline_for_groups);
      return reprioritizationDeadlineForGroups > reprioritizationDeadlineForApplicant;
    },
    {
      message: i18next.t(KEY.error_recruitment_form_4),
      path: ['reprioritization_deadline_for_groups'],
    },
  );

export type recruitmentFormType = z.infer<typeof recruitmentSchema>;
