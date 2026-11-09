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

const toggle = {
  control: { type: 'inline-radio', labels: { false: 'show', true: 'hide' } },
  options: [false, true],
} as const;

const meta: Meta<typeof EventCrudButtons> = {
  title: 'Components/EventCrudButtons',
  component: EventCrudButtons,
  decorators: [flexDecorator, userDecorator],
  argTypes: {
    removeView: toggle,
    removeEdit: toggle,
    removeCopy: toggle,
    removeManage: toggle,
    removeDelete: toggle,
  },
  args: {
    id: '123',
    size: 'md',
    removeView: false,
    removeEdit: false,
    removeCopy: false,
    removeManage: false,
    removeDelete: false,
  },
};

export default meta;

type Story = StoryObj<typeof EventCrudButtons>;

export const Default: Story = {};
