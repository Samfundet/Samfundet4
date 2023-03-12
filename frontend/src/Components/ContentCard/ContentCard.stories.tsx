import { ComponentMeta } from '@storybook/react';
import { ContentCard } from './ContentCard';

export default {
  title: 'Components/ContentCard',
  component: ContentCard,
  args: {},
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof ContentCard>;

export const Basic = ContentCard.bind({});
