import { useTranslation } from 'react-i18next';
import { Table } from '~/Components';
import type { RecruitmentUserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';

type Props = {
  applicant: RecruitmentUserDto | undefined;
};

export function RecruitmentApplicantInfo({ applicant }: Props) {
  const { t } = useTranslation();

  return (
    <Table
      data={[
        {
          cells: [t(KEY.common_phonenumber), applicant?.phone_number ? applicant?.phone_number : t(KEY.common_not_set)],
        },
        { cells: [t(KEY.common_email), applicant?.email ? applicant?.email : t(KEY.common_not_set)] },
        {
          cells: [t(KEY.common_campus), applicant?.campus ? dbT(applicant?.campus, 'name') : t(KEY.common_not_set)],
        },
      ]}
    />
  );
}
