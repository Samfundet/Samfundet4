import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { BackButton } from './BackButton';

// Local component config.
export default {
  title: 'Components/BackButton',
  component: BackButton,
  args: {
    message: 'Sigve: Konfirmasjon er bare en shitty versjon av bryllup',
  },
} as ComponentMeta<typeof BackButton>;

const Template: ComponentStory<typeof BackButton> = () => <BackButton />;

export const BackButtonTemplate = Template.bind({});
