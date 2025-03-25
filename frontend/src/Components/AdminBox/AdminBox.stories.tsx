import type { Meta, StoryObj } from '@storybook/react';
import { AdminBox } from './AdminBox';

// Local component config.
const meta: Meta<typeof AdminBox> = {
  title: 'Components/AdminBox',
  component: AdminBox,
};

export default meta;

type Story = StoryObj<typeof AdminBox>;

export const Basic: Story = {
  args: {
    title: 'Gjenger',
    icon: 'mdi:people-group',
    options: [
      { text: 'Administrer gjenger', url: 'www.google.com', type: 'ADD' },
      { text: 'Gjengene på huset', url: 'www.google.com', type: 'MANAGE' },
    ],
  },
};

export const Steal: Story = {
  args: {
    title: 'Stjel bruker',
    options: [{ text: 'Stjel identitet', url: 'www.google.com', type: 'STEAL' }],
  },
};

export const Info: Story = {
  args: {
    title: 'Tilgang',
    icon: 'material-symbols:help-outline-sharp',
    options: [
      {
        text: 'Har du ikke tilgang til en tjeneste du burde hatt tilgang til? Spør gjengsjefen din for å få tilgang.',
        url: '',
        type: 'INFO',
      },
      { text: '', url: '', type: 'KILROY' },
    ],
  },
};
