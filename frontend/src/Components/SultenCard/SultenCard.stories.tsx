import { ComponentMeta, ComponentStory } from '@storybook/react';
import { front_lyche } from '~/assets';
import { SultenCard } from './SultenCard';

// Local component config.
export default {
  title: 'Components/SultenCard',
  component: SultenCard,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof SultenCard>;

const Template: ComponentStory<typeof SultenCard> = function (args) {
  return <SultenCard {...args}>Submit</SultenCard>;
};

export const Basic = Template.bind({});
Basic.args = {
  image: front_lyche,
  header: 'Sulten',
  text: 'Sulten er en god ting',
  buttonText: 'Trykk her',
  smallCard: false,
};
