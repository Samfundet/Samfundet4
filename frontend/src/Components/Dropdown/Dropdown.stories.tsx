import type { ComponentMeta, ComponentStory, Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

// Local component config.
const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Mango', value: 'mango' },
];

const onChange = (value: unknown) => console.log('Selected:', value);

// Basic uncontrolled dropdown
export const Basic: Story = {
  args: {
    options,
    onChange,
  },
};

// With default value
export const WithDefaultValue: Story = {
  args: {
    options,
    defaultValue: 'banana',
    onChange,
  },
};

// With null option
export const WithNullOption: Story = {
  args: {
    options,
    nullOption: true,
    onChange,
  },
};

// With custom null option
export const WithCustomNullOption: Story = {
  args: {
    options,
    nullOption: { label: 'Select a fruit...', disabled: false },
    onChange,
  },
};

// With disabled null option (can't reselect null after choosing a value)
export const WithDisabledNullOption: Story = {
  args: {
    options,
    nullOption: { label: 'Select a fruit...', disabled: true },
    onChange,
  },
};

// With label
export const WithLabel: Story = {
  args: {
    options,
    label: 'Favorite Fruit',
    onChange,
  },
};
