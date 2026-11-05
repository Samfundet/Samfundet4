import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { SamfundetLogoSpinner } from '~/Components';
import { getRecruitmentPositions } from '~/api';
import { useGetOrganizedGangs } from '~/domain';
import type { RecruitmentPositionDto } from '~/dto';
import { GangPositionDropdown } from '../GangPositionDropdown';

export function GangTypeContainer() {
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [loadingPositions, setLoadingPositions] = useState<boolean>(true);
  const { recruitmentId } = useParams();
  const { data: recruitingGangTypes, isLoading: loadingGangTypes } = useGetOrganizedGangs();
  useEffect(() => {
    if (!recruitmentId) return;
    getRecruitmentPositions(recruitmentId)
      .then((recruitmentRes) => {
        setRecruitmentPositions(recruitmentRes.data);
        setLoadingPositions(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoadingPositions(false);
      });
  }, [recruitmentId]);

  return loadingPositions || loadingGangTypes ? (
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
