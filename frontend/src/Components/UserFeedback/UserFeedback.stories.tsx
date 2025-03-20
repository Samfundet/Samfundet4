import type { Meta, StoryObj } from '@storybook/react';
import { UserFeedback } from '~/Components/UserFeedback/UserFeedback';

// Local component config.
const meta: Meta<typeof UserFeedback> = {
  title: 'Components/UserFeedback',
  component: UserFeedback,
};

export default meta;

type Story = StoryObj<typeof UserFeedback>;

export const Primary: Story = {
  render: () => <UserFeedback />,
};
