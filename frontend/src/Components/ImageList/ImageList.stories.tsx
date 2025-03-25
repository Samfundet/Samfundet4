import type { Meta, StoryObj } from '@storybook/react';
import { ImageList } from './ImageList';

// Local component config.
const meta: Meta<typeof ImageList> = {
  title: 'Components/ImageList',
  component: ImageList,
};

export default meta;

type Story = StoryObj<typeof ImageList>;

export const Basic: Story = {
  args: {
    size: 64,
    images: [
      {
        name: 'TKS',
        src: 'https://samfundet.no/assets/groups/trondhjems%20kvinnelige%20studentersangforening-2c0ed4b706156642b5a46f93c9ca3c3bfa635ade4e02d22bf21befdb5f220d08.jpg',
      },
      {
        name: 'FG',
        src: 'https://samfundet.no/assets/groups/fotogjengen-f109febff76fe01fe48e632ef91a7c04d8d67537909e2f6e64e0219e0a77efa7.jpg',
      },
      {
        name: 'Under Dusken',
        src: 'https://samfundet.no/assets/groups/under%20dusken-5997cbd6fc91858b135e4910d92436849fcd0bd57fae961f6fc4814b5cd015e6.jpg',
      },
      {
        name: 'ARK',
        src: 'https://samfundet.no/assets/groups/akademisk%20radioklubb-cd2ce61eb1a6ce273fc3eb492c7a1a05255024e892dbad151c7ecc671d0a6df1.jpg',
      },
      {
        name: 'Profilgruppa',
        src: 'https://samfundet.no/assets/groups/profilgruppa-94148ec351fa28087a9ee826266c9c6ffd9cec2ffd04aa3c78b928f61bd459c8.jpg',
        url: 'www.google.com',
      },
    ],
  },
};
