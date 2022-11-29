import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ExpandableHeader } from './ExpandableHeader';

// Local component config.
export default {
  title: 'Components/ExpandableHeader',
  component: ExpandableHeader,
  args: {
    name: 'name',
    label: 'Choose option',
  },
} as ComponentMeta<typeof ExpandableHeader>;

const TemplateSingular: ComponentStory<typeof ExpandableHeader> = function (args) {
  return <ExpandableHeader {...args}></ExpandableHeader>;
};

const TemplateMultiple: ComponentStory<typeof ExpandableHeader> = function (args) {
  return (
    <>
      <ExpandableHeader {...args}></ExpandableHeader>
      <ExpandableHeader label="second child"></ExpandableHeader>
    </>
  );
};

export const Basic = TemplateSingular.bind({});
Basic.args = {
  children: <ExpandableHeader />,
};

export const Multiple = TemplateMultiple.bind({});
Basic.args = {
  children: <ExpandableHeader />,
};
