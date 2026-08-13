import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { TextAreaField } from './TextAreaField';

const meta: Meta<typeof TextAreaField> = {
  title: 'Components/TextAreaField',
  component: TextAreaField,
};

export default meta;

type Story = StoryObj<typeof TextAreaField>;

export const Basic: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    children: 'Label',
  },
};

export const WithComplexLabel: Story = {
  args: {
    children: <span style={{ color: 'red' }}>Complex label</span>,
  },
};

export const OnChange: Story = {
  args: {
    onChange: action('OnChange'),
  },
};
