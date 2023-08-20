import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { GangPosition } from '..';

type GangTypeProps = {
  gangTypes?: GangTypeDto[];
  recruitmentPositions?: RecruitmentPositionDto[];
};

export function GangTypeContainer({ gangTypes, recruitmentPositions }: GangTypeProps) {
  return (
    <>
      {gangTypes?.map((gangType) => (
        <GangPosition key={gangType.id} type={gangType} recruitmentPositions={recruitmentPositions} />
      ))}
    </>
  );
}
