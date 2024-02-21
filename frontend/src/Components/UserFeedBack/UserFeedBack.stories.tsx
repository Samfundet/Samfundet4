import { ComponentMeta, ComponentStory } from '@storybook/react';
import { UserFeedBack } from '~/Components/UserFeedBack/UserFeedBack';

// Local component config.
export default {
  title: 'Components/UserFeedBack',
  component: UserFeedBack,
} as ComponentMeta<typeof UserFeedBack>;

const Template: ComponentStory<typeof UserFeedBack> = () => {
  return <UserFeedBack enabled={true} />;
};

export const Primary = Template.bind({});
