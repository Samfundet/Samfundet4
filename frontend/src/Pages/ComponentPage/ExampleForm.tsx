import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '~/Components';
import { PASSWORD, USERNAME } from '~/schema/user';

const schema = z.object({
  username: USERNAME,
  password: PASSWORD,
  organization: z.string().nullish().optional(),
  duration: z.number().min(15).max(60),
  confirm: z.boolean().refine((v) => v, 'Påkrevd'),
  image_file: z
    .instanceof(File)
    .refine((file) => file.size < 1024 * 1024 * 2, {
      message: "File can't be larger than 2 MB",
    })
    .nullable(),
});

export function ExampleForm() {
  const [submitting, setSubmitting] = useState(false);
  const [serialized, setSerialized] = useState('');

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      organization: 'uka',
      duration: 15,
      confirm: false,
      image_file: null,
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    setSubmitting(true);
    console.debug(values);
    setSerialized(JSON.stringify(values));
    setTimeout(() => setSubmitting(false), 600);
  }

  const organizations = [
    { label: 'Samfundet', value: 'samfundet' },
    { label: 'UKA', value: 'uka' },
    { label: 'ISFiT', value: 'isfit' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} style={{ width: '300px', maxWidth: '100%' }}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brukernavn</FormLabel>
              <FormControl>
                <Input disabled={submitting} autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passord</FormLabel>
              <FormControl>
                <Input type="password" disabled={submitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organisasjon</FormLabel>
              <FormControl>
                <Dropdown options={organizations} disabled={submitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Varighet</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  disabled={submitting}
                  onChange={(event) => onChange(event.target.valueAsNumber)}
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bekreft</FormLabel>
              <FormControl>
                <Checkbox checked={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => onChange(event.target.files?.[0])}
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitting}>
          Lagre
        </Button>
        {serialized && (
          <pre>
            <code>{serialized}</code>
          </pre>
        )}
      </form>
    </Form>
  );
}
