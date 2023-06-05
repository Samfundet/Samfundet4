import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DynamicBuildingMap } from './DynamicBuildingMap';

// Local component config.
export default {
  title: 'Components/DynamicBuildingMap',
  component: DynamicBuildingMap,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof DynamicBuildingMap>;

const Template: ComponentStory<typeof DynamicBuildingMap> = function () {
  return <DynamicBuildingMap />;
};

export const Basic = Template.bind({});
