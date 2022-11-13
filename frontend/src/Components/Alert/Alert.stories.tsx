import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Alert } from './Alert';

// Local component config.
export default {
  title: 'Components/Alert',
  component: Alert,
  args: {
    message: 'Sigve:	Konfirmasjon er bare en shitty versjon av bryllup',
  },
} as ComponentMeta<typeof Alert>;

const TypesTemplate: ComponentStory<typeof Alert> = function (args) {
  return (
    <>
      <Alert {...args} type="info" />
      <Alert {...args} type="success" />
      <Alert {...args} type="warning" />
      <Alert {...args} type="error" />
      <Alert {...args} type="samf" />
    </>
  );
};

const Template: ComponentStory<typeof Alert> = function (args) {
  return <Alert {...args} />;
};

export const AllTypes = TypesTemplate.bind({});

export const WithTitle = TypesTemplate.bind({});
WithTitle.args = { title: 'Example Title' };

export const Closable = Template.bind({});
Closable.args = { closable: true };
