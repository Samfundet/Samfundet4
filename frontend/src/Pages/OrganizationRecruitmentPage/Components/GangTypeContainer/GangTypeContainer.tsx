import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { GangPositionDropdown } from '../GangPositionDropdown';

type GangTypeProps = {
  gangTypes?: GangTypeDto[];
  recruitmentPositions?: RecruitmentPositionDto[];
};

export function GangTypeContainer({ gangTypes, recruitmentPositions }: GangTypeProps) {
  return (
    <>
      {gangTypes?.map((gangType) => (
        <GangPositionDropdown key={gangType.id} type={gangType} recruitmentPositions={recruitmentPositions} />
      ))}
    </>
  );
}
