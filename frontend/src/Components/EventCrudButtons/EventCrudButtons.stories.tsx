import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { EventCrudButtons } from './EventCrudButtons';

const flexDecorator: Decorator = (Story) => (
  <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
    <Story />
  </div>
);

const meta: Meta<typeof EventCrudButtons> = {
  title: 'Components/EventEditButtons',
  component: EventCrudButtons,
  decorators: [flexDecorator],
};

export default meta;

type Story = StoryObj<typeof EventCrudButtons>;

export const Default: Story = {
  args: {
    is_staff: true,
    id: '123',
    title: 'Test event',
  },
};
