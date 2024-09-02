import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PASSWORD, USERNAME } from '~/schema/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';

export function ExampleForm() {
  const [submitting, setSubmitting] = useState(false);

  const schema = z.object({
    username: USERNAME,
    password: PASSWORD,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    console.debug('Validated values:', values);
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brukernavn</FormLabel>
              <FormControl>
                <Input disabled={submitting} {...field} />
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
        <Button type="submit" disabled={submitting}>
          Lagre
        </Button>
      </form>
    </Form>
  );
}
