import type { Meta, StoryObj } from '@storybook/react';
import { Child, ExpandableList, ExpandableListContextProvider, Parent } from './index';

// Local component config.
const meta: Meta<typeof ExpandableList> = {
  title: 'Components/ExpandableList',
  component: ExpandableList,
  args: {},
};

export default meta;

type Story = StoryObj<typeof ExpandableList>;

export const Basic: Story = {
  render: (args) => (
    <ExpandableListContextProvider>
      <ExpandableList {...args}>
        <Parent content="item1" nestedDepth={0}>
          <Child>
            <div>Child1</div>
          </Child>
          <Child>
            <div>Child2</div>
          </Child>
        </Parent>
        <Parent content="item2" nestedDepth={0}>
          <Child>
            <div>Child3</div>
          </Child>
          <Child>
            <div>Child4</div>
          </Child>
        </Parent>
      </ExpandableList>
    </ExpandableListContextProvider>
  ),
  args: { children: <div>Peek-a-Boo</div> },
};
