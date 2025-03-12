import type { Meta, StoryObj } from '@storybook/react';
import { DynamicBuildingMap } from './DynamicBuildingMap';

// Local component config.
const meta: Meta<typeof DynamicBuildingMap> = {
  title: 'Components/DynamicBuildingMap',
  component: DynamicBuildingMap,
};

export default meta;

type Story = StoryObj<typeof DynamicBuildingMap>;

export const Basic: Story = {
  render: (args) => <DynamicBuildingMap {...args} />,
};
