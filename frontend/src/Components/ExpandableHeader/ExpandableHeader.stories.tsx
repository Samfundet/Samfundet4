import type { ComponentMeta, ComponentStory } from '@storybook/react';
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

const TemplateSingular: ComponentStory<typeof ExpandableHeader> = (args) => <ExpandableHeader {...args} />;

const TemplateMultiple: ComponentStory<typeof ExpandableHeader> = (args) => (
  <>
    <ExpandableHeader {...args} />
    <ExpandableHeader {...args} />
  </>
);

export const Basic = TemplateSingular.bind({});
Basic.args = { children: <div>Peek-a-Boo</div> };

export const Nested = TemplateSingular.bind({});
Nested.args = {
  children: <ExpandableHeader />,
};

export const Multiple = TemplateMultiple.bind({});
Multiple.args = { children: <div>Peek-a-Boo</div> };
