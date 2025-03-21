import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

// Local component config.
export default {
  title: 'Components/Alert',
  component: Alert,
  args: {
    message: 'Sigve: Konfirmasjon er bare en shitty versjon av bryllup',
  },
} as Meta<typeof Alert>;

type Story = StoryObj<typeof Alert>;

const TypesTemplate: Story = {
  render: (args) => (
    <>
      <Alert {...args} type="info" />
      <Alert {...args} type="success" />
      <Alert {...args} type="warning" />
      <Alert {...args} type="error" />
      <Alert {...args} type="samf" />
    </>
  ),
};

const AlignTemplate: Story = {
  render: (args) => (
    <>
      <Alert {...args} />
      <Alert {...args} closable={true} />
      <Alert {...args} title={'Example Title'} />
      <Alert {...args} closable={true} title={'Example Title'} />
    </>
  ),
};

export const AllTypes: Story = {
  ...TypesTemplate,
};

export const WithTitle: Story = {
  ...TypesTemplate,
  args: {
    title: 'Example Title',
  },
};

export const Closable: Story = {
  ...TypesTemplate,
  args: {
    closable: true,
  },
};

export const AlignCenter: Story = {
  ...AlignTemplate,
  args: {
    align: 'center',
  },
};

export const AlignLeft: Story = {
  ...AlignTemplate,
  args: {
    align: 'left',
  },
};

export const AlignRight: Story = {
  ...AlignTemplate,
  args: {
    align: 'right',
  },
};
