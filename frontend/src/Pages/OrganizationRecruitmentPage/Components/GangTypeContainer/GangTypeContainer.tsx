import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { GangPositionDropdown } from '../GangPositionDropdown';
import { useEffect, useState } from 'react';
import { getActiveRecruitmentPositions, getGangList } from '~/api';
import { SamfundetLogoSpinner, Text } from '~/Components';

type GangTypeContainerProps = {
  recruitmentID: number;
};

// TODO: get positions for correct recruitment DO IN ISSUE #1114.
export function GangTypeContainer({ recruitmentID = 1 }: GangTypeContainerProps) {
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [recruitingGangTypes, setRecruitingGangs] = useState<GangTypeDto[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([getActiveRecruitmentPositions(), getGangList()])
      .then(([recruitmentRes, gangsRes]) => {
        setRecruitmentPositions(recruitmentRes.data);
        setRecruitingGangs(gangsRes);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);
  return loading ? (
    <SamfundetLogoSpinner />
  ) : (
    <>
      <Text>Placeholder for tag-search</Text>
      {recruitingGangTypes?.map((gangType) => (
        <GangPositionDropdown key={gangType.id} type={gangType} recruitmentPositions={recruitmentPositions} />
      ))}
    </>
  );
}
