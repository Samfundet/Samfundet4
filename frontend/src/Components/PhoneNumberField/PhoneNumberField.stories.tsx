import type { Meta, StoryObj } from '@storybook/react';
import { PhoneNumberField } from './PhoneNumberField';

const meta: Meta<typeof PhoneNumberField> = {
  title: 'Components/PhoneNumberField',
  component: PhoneNumberField,
};

export default meta;

type Story = StoryObj<typeof PhoneNumberField>;

export const Basic: Story = {
  render: (args) => (
    <form>
      <fieldset>
        <PhoneNumberField {...args} />
      </fieldset>
    </form>
  ),
};
