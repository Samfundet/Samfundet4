import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { GangPositionDropdown } from '../GangPositionDropdown';
import { useEffect, useState } from 'react';
import { getGangList, getRecruitmentPositions } from '~/api';
import { SamfundetLogoSpinner } from '~/Components';

type GangTypeContainerProps = {
  recruitmentID: string;
};

export function GangTypeContainer({ recruitmentID = '-1' }: GangTypeContainerProps) {
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [recruitingGangTypes, setRecruitingGangs] = useState<GangTypeDto[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([getRecruitmentPositions(recruitmentID), getGangList()])
      .then(([recruitmentRes, gangsRes]) => {
        setRecruitmentPositions(recruitmentRes.data);
        setRecruitingGangs(gangsRes);
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
      {recruitingGangTypes?.map((gangType) => (
        <GangPositionDropdown key={gangType.id} type={gangType} recruitmentPositions={recruitmentPositions} />
      ))}
    </>
  );
}
