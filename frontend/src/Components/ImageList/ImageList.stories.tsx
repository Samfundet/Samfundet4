/* eslint-disable max-len */
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ImageList } from './ImageList';

// Local component config.
export default {
  title: 'Components/ImageList',
  component: ImageList,
} as ComponentMeta<typeof ImageList>;

const Template: ComponentStory<typeof ImageList> = function (args) {
  return <ImageList {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  size: 64,
  images: [
    {
      title: 'TKS',
      src: 'https://samfundet.no/assets/groups/trondhjems%20kvinnelige%20studentersangforening-2c0ed4b706156642b5a46f93c9ca3c3bfa635ade4e02d22bf21befdb5f220d08.jpg',
    },
    {
      title: 'FG',
      src: 'https://samfundet.no/assets/groups/fotogjengen-f109febff76fe01fe48e632ef91a7c04d8d67537909e2f6e64e0219e0a77efa7.jpg',
    },
    {
      title: 'Under Dusken',
      src: 'https://samfundet.no/assets/groups/under%20dusken-5997cbd6fc91858b135e4910d92436849fcd0bd57fae961f6fc4814b5cd015e6.jpg',
    },
    {
      title: 'ARK',
      src: 'https://samfundet.no/assets/groups/akademisk%20radioklubb-cd2ce61eb1a6ce273fc3eb492c7a1a05255024e892dbad151c7ecc671d0a6df1.jpg',
    },
    {
      title: 'Profilgruppa',
      src: 'https://samfundet.no/assets/groups/profilgruppa-94148ec351fa28087a9ee826266c9c6ffd9cec2ffd04aa3c78b928f61bd459c8.jpg',
      url: 'www.google.com',
    },
  ],
};
