import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Modal } from './Modal';

// Local component config.
export default {
  title: 'Components/Modal',
  component: Modal,
  args: {
    isOpen: true,
  },
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = function (args) {
  return <Modal {...args}>Submit</Modal>;
};

export const Basic = Template.bind({});
Basic.args = {};
