import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PASSWORD, USERNAME } from '~/schema/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
  Input
} from '~/Components';

export function ExampleForm() {
  const [submitting, setSubmitting] = useState(false);
  const [serialized, setSerialized] = useState('');

  const schema = z.object({
    username: USERNAME,
    password: PASSWORD,
    organization: z.string().nullish().optional().or(z.literal('')),
    duration: z.number().min(15).max(60),
    confirm: z.boolean(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      organization: 'uka',
      duration: 15,
      confirm: false,
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    setSubmitting(true);
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Varighet</FormLabel>
              <FormControl>
                <Input type="number" disabled={submitting} {...field} />
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
