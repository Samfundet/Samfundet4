import type { Meta, StoryObj } from '@storybook/react';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { AuthContextProvider } from '~/context/AuthContext';
import { SamfForm } from './SamfForm';
import { SamfFormField } from './SamfFormField';

// Local component config.
const meta: Meta<typeof SamfForm> = {
  title: 'Forms/SamfForm',
  component: SamfForm,
};

export default meta;

type Story = StoryObj<typeof SamfForm>;

function validateShrimp(values: BasicFormProps) {
  const str = values.advanced_field;
  if (str?.toLowerCase().includes('reke')) return true;
  return "Feltet må inneholde 'reke'";
}

function validate69(values: BasicFormProps) {
  const num = values.number_field;
  if (num === 69) return true;
  return 'Tallet må være 69';
}

const options: DropdownOption<string>[] = [
  { label: 'Option 1', value: 'Option 1' },
  { label: 'Option 2', value: 'Option 2' },
];

type BasicFormProps = {
  req_field: string;
  advanced_field: string;
  number_field: number;
  option_field: string;
  large_field: string;
  phonenumber: string;
};

const initialData: BasicFormProps = {
  req_field: '',
  advanced_field: '',
  number_field: 420,
  option_field: options[0].value,
  large_field: 'Default text',
  phonenumber: '',
};

export const Basic: Story = {
  args: {
    submitTextProp: 'Demo',
    devMode: true,
    onSubmit: (values: BasicFormProps) => {
      alert(`Data that could be posted: ${JSON.stringify(values)}`);
    },
    initialData,
    validateOn: 'change',
    validateOnInit: false,
    children: (
      <>
        <div style={{ display: 'flex', gap: '.5em' }}>
          <SamfFormField<string, BasicFormProps>
            type={'text'}
            field={'req_field'}
            label="Tekst som er nødvendig"
            required={true}
          />
          <SamfFormField<string, BasicFormProps>
            type={'text'}
            field={'advanced_field'}
            label="Tekst med avansert krav"
            validator={validateShrimp}
          />
        </div>
        <div style={{ display: 'flex', gap: '.5em' }}>
          <SamfFormField<number, BasicFormProps>
            type={'number'}
            field={'number_field'}
            label="Tall-input med krav"
            validator={validate69}
          />
          <SamfFormField<string, BasicFormProps>
            type={'options'}
            field={'option_field'}
            label="Dropdown input"
            options={options}
          />
        </div>
        <SamfFormField<string, BasicFormProps>
          type={'text_long'}
          field={'large_field'}
          label="Lang tekst input"
          props={{ rows: 5 }}
        />
        <SamfFormField<string, BasicFormProps> type={'phonenumber'} field={'phonenumber'} label="Phonenumber" />
      </>
    ),
  },
  render: (args) => (
    <AuthContextProvider>
      <SamfForm<BasicFormProps> {...args} />
    </AuthContextProvider>
  ),
} as Story;
