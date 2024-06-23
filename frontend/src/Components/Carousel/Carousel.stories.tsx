import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { Carousel } from './Carousel';

// Local component config.
export default {
  title: 'Components/Carousel',
  component: Carousel,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof Carousel>;

const Template: ComponentStory<typeof Carousel> = (args) => (
    <Carousel {...args}>
      {[...Array(100)].map((_, i) => (
        <div key={i} style={{ width: '400px', height: '250px', background: '#aaa', borderRadius: '1em' }} />
      ))}
    </Carousel>
  );

const TemplateSmall: ComponentStory<typeof Carousel> = (args) => (
    <Carousel {...args}>
      {[...Array(100)].map((_, i) => (
        <div key={i} style={{ width: '50px', height: '50px', background: '#aaa', borderRadius: '1em' }} />
      ))}
    </Carousel>
  );

export const Basic = Template.bind({});
Basic.args = {
  header: 'Carousel (basic)',
};

export const SmallItems = TemplateSmall.bind({});
SmallItems.args = {
  header: 'Carousel (small items)',
};
