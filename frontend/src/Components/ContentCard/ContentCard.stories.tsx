import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { ContentCard } from '~/Components';

export default {
  title: 'Components/ContentCard',
  component: ContentCard,
} as ComponentMeta<typeof ContentCard>;

const Template: ComponentStory<typeof ContentCard> = (args) => <ContentCard {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  title: 'Cute kitteh',
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus provident maiores eveniet quibusdam esse facere quos, laudantium dignissimos illum placeat quia animi possimus rerum libero deleniti nam in distinctio voluptates!',
  buttonText: 'Example',
  imageUrl:
    'https://weu-az-web-ca-cdn.azureedge.net/mediacontainer/medialibraries/mypetdoctor/images/blog-images/grey-kitten.webp?ext=.webp',
  url: '#',
};
