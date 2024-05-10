import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PhoneNumberField } from './PhoneNumberField';

export default {
  title: 'Components/PhoneNumberField',
  component: PhoneNumberField,
} as ComponentMeta<typeof PhoneNumberField>;

const Template: ComponentStory<typeof PhoneNumberField> = function (args) {
  return (
    <form>
      <fieldset>
        <PhoneNumberField {...args} />
      </fieldset>
    </form>
  );
};

export const Basic = Template.bind({});
