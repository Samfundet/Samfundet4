import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { PhoneNumberField } from './PhoneNumberField';

export default {
  title: 'Components/PhoneNumberField',
  component: PhoneNumberField,
} as ComponentMeta<typeof PhoneNumberField>;

const Template: ComponentStory<typeof PhoneNumberField> = (args) => (
    <form>
      <fieldset>
        <PhoneNumberField {...args} />
      </fieldset>
    </form>
  );

export const Basic = Template.bind({});
