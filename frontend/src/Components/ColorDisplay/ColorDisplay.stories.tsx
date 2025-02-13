import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { COLORS, type ColorKey } from '~/types';
import { ColorDisplay } from './ColorDisplay';

// Local component config.
export default {
  title: 'Components/ColorDisplay',
  component: ColorDisplay,
} as ComponentMeta<typeof ColorDisplay>;

const ListTemplate: ComponentStory<typeof ColorDisplay> = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    {Object.keys(COLORS).map((key) => (
      <ColorDisplay key={key} color={key as ColorKey} />
    ))}
  </div>
);

export const AllColors = ListTemplate.bind({});
