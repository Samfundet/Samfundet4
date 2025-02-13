import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { RejectionMail } from './RejectionMail';

export default {
  title: 'Components/RejectionMail',
  component: RejectionMail,
} as ComponentMeta<typeof RejectionMail>;

const Template: ComponentStory<typeof RejectionMail> = () => <RejectionMail />;

export const Basic = Template.bind({});
