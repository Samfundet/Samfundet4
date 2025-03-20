import type { Meta, StoryObj } from '@storybook/react';
import { ContentCard } from '~/Components';

const meta: Meta<typeof ContentCard> = {
  title: 'Components/ContentCard',
  component: ContentCard,
};

export default meta;

type Story = StoryObj<typeof ContentCard>;

export const Basic: Story = {
  args: {
    title: 'Cute kitteh',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus provident maiores eveniet quibusdam esse facere quos, laudantium dignissimos illum placeat quia animi possimus rerum libero deleniti nam in distinctio voluptates!',
    buttonText: 'Example',
    imageUrl:
      'https://weu-az-web-ca-cdn.azureedge.net/mediacontainer/medialibraries/mypetdoctor/images/blog-images/grey-kitten.webp?ext=.webp',
    url: '#',
  },
};
