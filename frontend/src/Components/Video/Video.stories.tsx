import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Video } from './Video';

// Local component config.
export default {
  title: 'Components/Video',
  component: Video,
  args: {
    name: 'name',
    label: 'Approve',
  },
} as ComponentMeta<typeof Video>;

const Template: ComponentStory<typeof Video> = function (args) {
  return <Video {...args} />;
};

export const Basic = Template.bind({});
Basic.args = { embedId: '88kgbMcDIQ4' };
