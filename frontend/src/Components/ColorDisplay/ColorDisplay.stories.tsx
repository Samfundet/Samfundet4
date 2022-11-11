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
      {Object.entries(COLORS).map(([key], index) => {
        const colorkey = key as ColorKey;
        return <ColorDisplay key={index} color={colorkey} />;
      })}
    </div>
  );
};

export const SamfundetRed = ListTemplate.bind({});
