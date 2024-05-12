import { GangDto, GangTypeDto, OrganizationRecruitmentDto, SectionDto } from '~/dto';

export const getTags = (recruitment_data: OrganizationRecruitmentDto): string[] => {
  const tagsSet = new Set<string>();

  recruitment_data.recruiting_gang_types.forEach((gangType: GangTypeDto) => {
    gangType.gangs.forEach((gang: GangDto) => {
      gang.sections.forEach((section: SectionDto) => {
        section.recruitment_positions.forEach((position) => {
          position.tags.split(', ').forEach((tag) => {
            tagsSet.add(tag.trim());
          });
        });
      });
    });
  });

  return Array.from(tagsSet);
};
