import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SamfundetLogoSpinner } from './SamfundetLogoSpinner';

// Local component config.
export default {
  title: 'Components/SamfundetLogoSpinner',
  component: SamfundetLogoSpinner,
} as ComponentMeta<typeof SamfundetLogoSpinner>;

const Template: ComponentStory<typeof SamfundetLogoSpinner> = function () {
  return (
    <div style={{ margin: '50px' }}>
      <SamfundetLogoSpinner />
    </div>
  );
};

export const Basic = Template.bind({});
