import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { UserFeedback } from '~/Components/UserFeedback/UserFeedback';

// Local component config.
export default {
  title: 'Components/UserFeedback',
  component: UserFeedback,
} as ComponentMeta<typeof UserFeedback>;

const Template: ComponentStory<typeof UserFeedback> = () => {
  return <UserFeedback enabled={true} />;
};

export const Primary = Template.bind({});
