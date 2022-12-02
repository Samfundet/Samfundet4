import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ColorKey, COLORS } from '~/types';
import { ColorDisplay } from './ColorDisplay';

// Local component config.
export default {
  title: 'Components/ColorDisplay',
  component: ColorDisplay,
} as ComponentMeta<typeof ColorDisplay>;

const ListTemplate: ComponentStory<typeof ColorDisplay> = function () {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {Object.keys(COLORS).map((key, index) => (
        <ColorDisplay key={index} color={key as ColorKey} />
      ))}
    </div>
  );
};

export const AllColors = ListTemplate.bind({});
