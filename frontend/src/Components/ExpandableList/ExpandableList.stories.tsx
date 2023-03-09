import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Child, ExpandableList, ExpandableListContextProvider, Parent } from './index';

// Local component config.
export default {
  title: 'Components/ExpandableList',
  component: ExpandableList,
  args: {
    name: 'name',
    label: 'Choose option',
  },
} as ComponentMeta<typeof ExpandableList>;

const TemplateSingular: ComponentStory<typeof ExpandableList> = function (args) {
  return (
    <>
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
    </>
  );
};

export const Basic = TemplateSingular.bind({});
Basic.args = { children: <div>Peek-a-Boo</div> };
