import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { InputField } from './InputField';

// Define the meta object, which contains metadata about your component.
const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
};

export default meta;

// Define the base type for the story.
type Story = StoryObj<typeof InputField>;

// Basic Story
export const Basic: Story = {
  render: (args) => (
    <form>
      <fieldset>
        <InputField {...args} />
      </fieldset>
    </form>
  ),
};

// With Label Story
export const WithLabel: Story = {
  render: (args) => (
    <form>
      <fieldset>
        <InputField {...args} />
      </fieldset>
    </form>
  ),
  args: {
    children: 'Label',
  },
};

// With Complex Label Story
export const WithComplexLabel: Story = {
  render: (args) => (
    <form>
      <fieldset>
        <InputField {...args} />
      </fieldset>
    </form>
  ),
  args: {
    children: <span style={{ color: 'red' }}>Complex label</span>,
  },
};

// On Change Story
export const OnChange: Story = {
  render: (args) => (
    <form>
      <fieldset>
        <InputField {...args} />
      </fieldset>
    </form>
  ),
  args: {
    onChange: action('OnChange'),
  },
};
