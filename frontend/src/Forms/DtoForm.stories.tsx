import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import { EventDto } from '~/dto';
import { GenericForm } from './GenericForm';

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
      <GenericForm {...args} onChange={setData}/>
      <p>Non-generic model output of type {typeof data}:</p>
      <p>
        {JSON.stringify(data)}
      </p>
    </div>
  );
};

const event: Partial<EventDto> = {
  title_nb: 'some norwegian title',
  title_en: 'some english title',
};
export const Basic = Template.bind({});
Basic.args = {
  initialData: event,
  layout: [
   [
    {key: 'title_nb', type: 'text', label: 'Tittel (norsk)'}, 
    {key: 'title_en', type: 'text', label: 'Tittel (engelsk)'}
  ],
  ]
};
