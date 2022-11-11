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
  title: 'Gjenger',
  options: [
    { text: 'Administrer gjenger', url: 'www.google.com', type: 'ADD' },
    { text: 'Gjengene på huset', url: 'www.google.com', type: 'MANAGE' },
  ],
};

export const Steal = Template.bind({});
Steal.args = {
  title: 'Stjel bruker',
  options: [{ text: 'Stjel identitet', url: 'www.google.com', type: 'STEAL' }],
};

export const Info = Template.bind({});
Info.args = {
  title: 'Tilgang',
  options: [
    {
      text: 'Har du ikke tilgang til en tjeneste du burde hatt tilgang til? Spør gjenglederen din for å få tilgang.',
      url: '',
      type: 'INFO',
    },
    { text: '', url: '', type: 'KILROY' },
  ],
};
