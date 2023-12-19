import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { UserDto } from '~/dto';

export function mapUserToMultiselectOption(user: UserDto): DropDownOption<UserDto> {
  return {
    label: `${user?.username} ${user?.first_name} ${user?.last_name}`,
    value: user,
  };
}
