import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import type { EventStatus } from '~/types';

export type EventStatusOption = DropdownOption<EventStatus> & {
  description: string;
};
