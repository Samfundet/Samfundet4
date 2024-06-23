import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from '~/Components/Button';
import { Countdown } from './Countdown';

export default {
  title: 'Components/Countdown',
  component: Countdown,
} as ComponentMeta<typeof Countdown>;

const Template: ComponentStory<typeof Countdown> = (args) => (
    <Countdown {...args}>
      <Button theme="green">he he he haw, Guilty</Button>
    </Countdown>
  );

export const Basic = Template.bind({});
Basic.args = {
  targetDate: new Date(new Date(new Date().getTime() + 60 * 60 * 24 * 1000)),
};

export const Short = Template.bind({});
Short.args = {
  targetDate: new Date(new Date(new Date().getTime() + 60 * 1000 * 5)),
};
