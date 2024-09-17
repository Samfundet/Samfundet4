import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { Alert } from './Alert';

// Local component config.
export default {
  title: 'Components/Alert',
  component: Alert,
  args: {
    message: 'Sigve: Konfirmasjon er bare en shitty versjon av bryllup',
  },
} as ComponentMeta<typeof Alert>;

const TypesTemplate: ComponentStory<typeof Alert> = (args) => (
  <>
    <Alert {...args} type="info" />
    <Alert {...args} type="success" />
    <Alert {...args} type="warning" />
    <Alert {...args} type="error" />
    <Alert {...args} type="samf" />
  </>
);

const AlignTemplate: ComponentStory<typeof Alert> = (args) => (
  <>
    <Alert {...args} />
    <Alert {...args} closable={true} />
    <Alert {...args} title={'Example Title'} />
    <Alert {...args} closable={true} title={'Example Title'} />
  </>
);

export const AllTypes = TypesTemplate.bind({});

export const WithTitle = TypesTemplate.bind({});
WithTitle.args = { title: 'Example Title' };

export const Closable = TypesTemplate.bind({});
Closable.args = { closable: true };

export const AlignCenter = AlignTemplate.bind({});
AlignCenter.args = { align: 'center' };

export const AlignLeft = AlignTemplate.bind({});
AlignLeft.args = { align: 'left' };

export const AlignRight = AlignTemplate.bind({});
AlignRight.args = { align: 'right' };
