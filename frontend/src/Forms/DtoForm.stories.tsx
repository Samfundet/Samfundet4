import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import { EventDto } from '~/dto';
import { FormField, GenericForm } from './GenericForm';

// Local component config.
export default {
  title: 'Forms/GenericForm',
  component: GenericForm,
} as ComponentMeta<typeof GenericForm>;

const Template: ComponentStory<typeof GenericForm> = function (args) {
  const [data, setData] = useState<Partial<EventDto>>(args.initialData as EventDto);

  return (
    <div>
      <p>Generic Form:</p>
      <GenericForm<EventDto> {...args} onChange={setData} />
      <br></br>
      <p>Non-generic model output of type {typeof data}:</p>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

const event: Partial<EventDto> = {
  title_nb: 'Reker er snille',
  title_en: undefined,
  description_short_nb: undefined,
  description_short_en: undefined,
  duration: undefined,
};

function validateShrimp(str: string) {
  if (str.toLowerCase().includes('reke')) return true;
  return "Tittel må inneholde 'reke'";
}

function validateMinLength(str: string) {
  if (str.length >= 60) return true;
  return 'Må være minst 60 bokstaver.';
}

function validate69(num: number) {
  if (num == 69) return true;
  return 'Tallet må være 69';
}

export const Basic = Template.bind({});
Basic.args = {
  initialData: event,
  validateOn: 'change',
  layout: [
    [
      { key: 'title_nb', type: 'text', label: 'Tittel (norsk)', validator: validateShrimp } as FormField<string>,
      { key: 'title_en', type: 'text', label: 'Tittel (engelsk)' },
    ],
    [
      {
        key: 'description_short_nb',
        type: 'text',
        label: 'Kort beskrivelse (norsk)',
        validator: validateMinLength,
      } as FormField<string>,
      {
        key: 'description_short_en',
        type: 'text',
        label: 'Kort beskrivelse (engelsk)',
        validator: validateMinLength,
      } as FormField<string>,
    ],
    [{ key: 'duration', type: 'number', label: 'Varighet (minutter)', validator: validate69 } as FormField<number>],
  ],
};
