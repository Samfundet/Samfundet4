import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { CrudButtons } from './CrudButtons';

// Local component config.
export default {
  title: 'Components/CrudButtons',
  component: CrudButtons,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof CrudButtons>;

const Template: ComponentStory<typeof CrudButtons> = () => {
  function onClick() {
    alert('Hello!');
  }
  return <CrudButtons onEdit={onClick} onDelete={onClick} />;
};

export const Basic = Template.bind({});
