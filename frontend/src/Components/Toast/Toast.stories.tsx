import { ComponentMeta, ComponentStory } from '@storybook/react';
import { POSITIONS, Toast } from './Toast';

// Local component config.
export default {
  title: 'Components/Toast',
  component: Toast,
  args: {
    title: 'Some random title',
    message: 'Some longer and arbitrary message',
    delay: 30_000,
  },
} as ComponentMeta<typeof Toast>;

const AllPositionsTemplate: ComponentStory<typeof Toast> = function (args) {
  return (
    <>
      {POSITIONS.map((position) => (
        <Toast key={position} {...args} position={position} />
      ))}
    </>
  );
};

export const AllPositions = AllPositionsTemplate.bind({});
