import { DepartmentDto, RecruitmentPositionDto } from '~/dto';
import { useEffect, useState } from 'react';
import { SamfundetLogoSpinner } from '~/Components';
import { getGangList, getRecruitmentPositions } from '~/api';
import { GangPositionDropdown } from '../GangPositionDropdown';

type DepartmentContainerProps = {
  recruitmentID: string;
};

export function DepartmentContainer({ recruitmentID = '-1' }: DepartmentContainerProps) {
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [recruitingDepartments, setRecruitingDepartments] = useState<DepartmentDto[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([getRecruitmentPositions(recruitmentID), getGangList()])
      .then(([recruitmentRes, gangsRes]) => {
        setRecruitmentPositions(recruitmentRes.data);
        setRecruitingDepartments(gangsRes);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [recruitmentID]);

  return loading ? (
    <SamfundetLogoSpinner />
  ) : (
    <>
      {recruitingDepartments?.map((department) => (
        <GangPositionDropdown key={department.id} type={department} recruitmentPositions={recruitmentPositions} />
      ))}
    </>
  );
}
