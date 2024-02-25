import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AuthContextProvider } from '~/AuthContext';
import { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { EventDto } from '~/dto';
import { SamfForm } from './SamfForm';
import { SamfFormField } from './SamfFormField';

// Local component config.
export default {
  title: 'Forms/SamfForm',
  component: SamfForm,
} as ComponentMeta<typeof SamfForm>;

const Template: ComponentStory<typeof SamfForm> = function (args) {
  return (
    <AuthContextProvider>
      <SamfForm<EventDto> {...args} onSubmit={(v) => alert('Data that could be posted: ' + JSON.stringify(v))} />
    </AuthContextProvider>
  );
};

function validateShrimp(str: string) {
  if (str && str.toLowerCase().includes('reke')) return true;
  return "Feltet må inneholde 'reke'";
}

function validate69(num: number) {
  if (num == 69) return true;
  return 'Tallet må være 69';
}

const options: DropDownOption<string>[] = [
  { label: 'Option 1', value: 'Option 1' },
  { label: 'Option 2', value: 'Option 2' },
];

export const Basic = Template.bind({});
Basic.args = {
  submitText: 'Lagre - Demo',
  devMode: true,
  children: (
    <>
      <div style={{ display: 'flex', gap: '.5em' }}>
        <SamfFormField field="required_text" type="text" label="Tekst som er nødvendig" required={true} />
        <SamfFormField
          field="spesific_text"
          type="text"
          label="Tekst med avansert krav"
          validator={validateShrimp}
          required={false}
        />
      </div>
      <div style={{ display: 'flex', gap: '.5em' }}>
        <SamfFormField
          field="spesific_number"
          type="number"
          label="Tall-input med krav"
          validator={validate69}
          required={false}
        />
        <SamfFormField field="category" type="options" label="Dropdown input" options={options} required={false} />
      </div>
      <SamfFormField field="text_long" type="text-long" label="Lang tekst input" props={{ rows: 5 }} required={false} />
      <SamfFormField field="phonenumber" type="phonenumber" label="Phonenumber" required={false} />
    </>
  ),
};
