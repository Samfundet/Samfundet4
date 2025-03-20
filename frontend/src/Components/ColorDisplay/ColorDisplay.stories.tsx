import type { Meta, StoryObj } from '@storybook/react';
import { COLORS, type ColorKey } from '~/types';
import { ColorDisplay } from './ColorDisplay';

// Local component config.
const meta: Meta<typeof ColorDisplay> = {
  title: 'Components/ColorDisplay',
  component: ColorDisplay,
};

export default meta;

type Story = StoryObj<typeof ColorDisplay>;

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {Object.keys(COLORS).map((key) => (
        <ColorDisplay key={key} color={key as ColorKey} />
      ))}
    </div>
  ),
};
