import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SamfundetLogoSpinner } from '~/Components';
import { getGangList, getRecruitmentPositions } from '~/api';
import type { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { GangPositionDropdown } from '../GangPositionDropdown';

export function GangTypeContainer() {
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [recruitingGangTypes, setRecruitingGangs] = useState<GangTypeDto[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const { recruitmentId } = useParams();
  useEffect(() => {
    if (!recruitmentId) return;
    Promise.all([getRecruitmentPositions(recruitmentId), getGangList()])
      .then(([recruitmentRes, gangsRes]) => {
        setRecruitmentPositions(recruitmentRes.data);
        setRecruitingGangs(gangsRes);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [recruitmentId]);

  return loading ? (
    <SamfundetLogoSpinner />
  ) : (
    <>
      {recruitingGangTypes?.map((gangType) => (
        <GangPositionDropdown
          key={gangType.id}
          type={gangType}
          recruitmentPositions={recruitmentPositions}
          recruitmentId={recruitmentId}
        />
      ))}
    </>
  );
}
