import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { MockAuthContextProvider } from '~/context/AuthContext';
import { EventCrudButtons } from './EventCrudButtons';

const flexDecorator: Decorator = (Story) => (
  <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
    <Story />
  </div>
);

const userDecorator: Decorator = (Story) => (
  <MockAuthContextProvider>
    <Story />
  </MockAuthContextProvider>
);

const meta: Meta<typeof EventCrudButtons> = {
  title: 'Components/EventCrudButtons',
  component: EventCrudButtons,
  decorators: [flexDecorator, userDecorator],
};

export default meta;

type Story = StoryObj<typeof EventCrudButtons>;

export const Default: Story = {
  args: {
    id: '123',
    title: 'Test event',
    height: undefined,
    have_view: true,
  },
};
