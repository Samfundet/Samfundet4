import { KEY } from '~/i18n/constants';
import { COLORS } from '~/types';

export const RecruitmentApplicantStates = {
  // Application state (model_choices.py in RecruitmentApplicantStates)
  NOT_SET: 0, // needs processing here
  TOP_PRI_RESERVED_HERE: 1, // going here
  TOP_PRI_WANTED_HERE: 2, // might go here
  RESERVED_ELSEWHERE_UNPROCESSED_HERE: 3, // needs processing here
  RESERVED_ELSEWHERE_RESERVED_HERE: 4, // going elsewhere, does not go here due to `applicant_prioirity` higher elsewhere
  RESERVED_ELSEWHERE_WANTED_HERE: 5, // going elsewhere, does not go here due to `applicant_prioirity` higher elsewhere
  WANTED_ELSEWHERE_UNPROCESSED_HERE: 6, // needs processing here
  WANTED_ELSEWHERE_RESERVE_HERE: 7, // going elsewhere, does not go here due to `applicant_prioirity` higher elsewhere
  WANTED_ELSEWHERE_WANTED_HERE: 8, // going elsewhere, does not go here due to `applicant_prioirity` higher elsewhere
  NOT_WANTED: 10, // does not go here
} as const;

export const RecruitmentApplicantStatesDescriptions: {
  [key: number]: {
    short: string;
    long: string;
    guidance: string;
  };
} = {
  0: {
    short: KEY.not_set_short,
    long: KEY.not_set_long,
    guidance: KEY.application_needs_processing,
  },
  1: {
    short: KEY.top_pri_reserved_here_short,
    long: KEY.top_pri_reserved_here_long,
    guidance: KEY.top_pri_reserved_here_guidance,
  },
  2: {
    short: KEY.top_pri_wanted_here_short,
    long: KEY.top_pri_wanted_here_long,
    guidance: KEY.top_pri_wanted_here_guidance,
  },
  3: {
    short: KEY.reserved_elsewhere_unprocessed_here_short,
    long: KEY.reserved_elsewhere_unprocessed_here_long,
    guidance: KEY.application_needs_processing,
  },
  4: {
    short: KEY.reserved_elsewhere_reserved_here_short,
    long: KEY.reserved_elsewhere_reserved_here_long,
    guidance: KEY.do_not_contact,
  },
  5: {
    short: KEY.reserved_elsewhere_wanted_here_short,
    long: KEY.reserved_elsewhere_wanted_here_long,
    guidance: KEY.do_not_contact,
  },
  6: {
    short: KEY.wanted_elsewhere_unprocessed_here_short,
    long: KEY.wanted_elsewhere_unprocessed_here_long,
    guidance: KEY.application_needs_processing,
  },
  7: {
    short: KEY.wanted_elsewhere_reserve_here_short,
    long: KEY.wanted_elsewhere_reserve_here_long,
    guidance: KEY.do_not_contact,
  },
  8: {
    short: KEY.wanted_elsewhere_wanted_here_short,
    long: KEY.wanted_elsewhere_wanted_here_long,
    guidance: KEY.do_not_contact,
  },
  10: {
    short: KEY.not_wanted_short,
    long: KEY.not_wanted_long,
    guidance: KEY.do_not_contact,
  },
};

// Helper function to get state name
export const getRecruitmentApplicantStateName = (
  state: number,
): {
  short: string;
  long: string;
  guidance: string;
} => {
  return RecruitmentApplicantStatesDescriptions[state] || 'Unknown state!!';
};

// Color mapping for applicant states
export const ApplicationStateColorMapping: { [key: number]: { background: string; forground: string } } = {
  // Application state colors (model_choices.py in RecruitmentApplicantStates)
  [RecruitmentApplicantStates.NOT_SET]: { background: COLORS.action_needed_here, forground: COLORS.black },
  [RecruitmentApplicantStates.TOP_PRI_RESERVED_HERE]: { background: COLORS.might_contact, forground: COLORS.white },
  [RecruitmentApplicantStates.TOP_PRI_WANTED_HERE]: { background: COLORS.will_contact, forground: COLORS.white },
  [RecruitmentApplicantStates.RESERVED_ELSEWHERE_UNPROCESSED_HERE]: {
    background: COLORS.action_needed_here,
    forground: COLORS.black,
  },
  [RecruitmentApplicantStates.RESERVED_ELSEWHERE_RESERVED_HERE]: {
    background: COLORS.do_not_contact,
    forground: COLORS.white,
  },
  [RecruitmentApplicantStates.RESERVED_ELSEWHERE_WANTED_HERE]: {
    background: COLORS.do_not_contact,
    forground: COLORS.white,
  },
  [RecruitmentApplicantStates.WANTED_ELSEWHERE_UNPROCESSED_HERE]: {
    background: COLORS.action_needed_here,
    forground: COLORS.black,
  },
  [RecruitmentApplicantStates.WANTED_ELSEWHERE_RESERVE_HERE]: {
    background: COLORS.do_not_contact,
    forground: COLORS.white,
  },
  [RecruitmentApplicantStates.WANTED_ELSEWHERE_WANTED_HERE]: {
    background: COLORS.do_not_contact,
    forground: COLORS.white,
  },
  [RecruitmentApplicantStates.NOT_WANTED]: { background: COLORS.not_wanted, forground: COLORS.black },
};

// Helper function to get the color for a state
export const getApplicantStateColor = (state: number): { background: string; forground: string } => {
  return ApplicationStateColorMapping[state] || COLORS.white;
};
