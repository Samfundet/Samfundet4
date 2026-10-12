import type { Meta, StoryObj } from '@storybook/react';
import { InterviewForm } from './InterviewForm';

const meta: Meta<typeof InterviewForm> = {
  title: 'Components/InterviewForm',
  component: InterviewForm,
};

export default meta;

type Story = StoryObj<typeof InterviewForm>;

export const Basic: Story = {
  args: {
    application: {
      id: '123',
      interview: {
        interview_time: '2026-10-20T14:00:00Z',
        interview_location: 'Klubba',
      },
      user: { first_name: 'Ola', last_name: 'Nordmann' },
      recruitment_position: { name_nb: 'Webutvikler', name_en: 'Web developer' },
    },
  },
};
