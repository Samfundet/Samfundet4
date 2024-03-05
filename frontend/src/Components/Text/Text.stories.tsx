import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Text } from '~/Components/Text/Text';

// Local component config.
export default {
  title: 'Components/Text',
  component: Text,
} as ComponentMeta<typeof Text>;


const Template: ComponentStory<typeof Text> = () => {
  return (
    <div>
      <Text>Standard text</Text>
      <Text noOfLines={2}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
        when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </Text>
      <Text type={"strong"}>Bold text</Text>
      <Text size={"xs"}>Extra Small text</Text>
      <Text size={"s"}>Small text</Text>
      <Text size={"m"}>Medium / Normal text</Text>
      <Text size={"l"}>Large text</Text>
      <Text size={"xl"}>Extra Large text</Text>
      <Text size={"2xl"}>Extra Extra Large text</Text>
    </div>
  );
};

export const Primary = Template.bind({});
