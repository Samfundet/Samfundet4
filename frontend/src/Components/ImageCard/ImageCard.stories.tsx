import { ComponentMeta } from '@storybook/react';
import { ImageCard } from './ImageCard';

export default {
  title: 'Components/ImageCard',
  component: ImageCard,
  args: {},
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof ImageCard>;

export const Basic = ImageCard.bind({});
