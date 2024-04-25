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
      <Text>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
        industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
        electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of
        Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
        PageMaker including versions of Lorem Ipsum.
      </Text>
      <br />
      <Text as={'p'}>p - Paragraph / Normal text</Text>
      <Text as={'strong'}>bold - Bold text</Text>
      <Text as={'u'}>u - Underline text</Text>
      <Text as={'i'}>i - Italic text</Text>
      <Text as={'em'}>em - Emphasized text</Text>
      <Text as={'mark'}>mark - Marked / Highlighted text</Text>
      <Text as={'del'}>del - Deleted text</Text>
      <Text as={'ins'}>ins - Inserted text</Text>
      <br />
      <Text size={'xs'}>Extra Small text</Text>
      <Text size={'s'}>Small text</Text>
      <Text size={'m'}>Medium / Normal text</Text>
      <Text size={'l'}>Large text</Text>
      <Text size={'xl'}>Extra Large text</Text>
      <Text size={'2xl'}>Extra Extra Large text</Text>
    </div>
  );
};

export const Primary = Template.bind({});
