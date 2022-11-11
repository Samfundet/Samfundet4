import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AdminBox } from './AdminBox';

// Local component config.
export default {
  title: 'Components/AdminBox',
  component: AdminBox,
} as ComponentMeta<typeof AdminBox>;

const Template: ComponentStory<typeof AdminBox> = function (args) {
  return <AdminBox {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  title: 'Bodegaen',
  options: [
    { text: 'Opprett ny kjønnsykdom', url: 'www.google.com', type: 'ADD' },
    { text: 'Vis Alle Kjønnsykdommer', url: 'www.google.com', type: 'MANAGE' },
  ],
};

export const Steal = Template.bind({});
Steal.args = {
  title: 'Stjel Kakefat',
  options: [{ text: 'Stjel identitet', url: 'www.google.com', type: 'STEAL' }],
};

export const Info = Template.bind({});
Info.args = {
  title: 'Info',
  options: [
    { text: 'Dersom du ser dette er du en dum agurk', url: '', type: 'INFO' },
    { text: '', url: '', type: 'KILROY' },
  ],
};
