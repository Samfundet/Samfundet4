import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { splash } from '~/assets';
import { ImageCard } from './ImageCard';

const now = new Date();

export default {
  title: 'Components/ImageCard',
  component: ImageCard,
  args: {
    image: splash
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof ImageCard>;

export const Basic = ImageCard.bind({ image });
