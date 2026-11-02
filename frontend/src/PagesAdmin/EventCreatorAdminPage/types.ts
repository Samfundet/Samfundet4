import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import type { EventStatus } from '~/domain';

export type EventStatusOption = DropdownOption<EventStatus> & {
  description: string;
};
