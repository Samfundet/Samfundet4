import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import styles from './Forms.module.scss';
import { z, type ZodTypeAny } from "zod";

const FormSchemaContext = React.createContext<ZodTypeAny | null>(null);

type FormProps<T extends FieldValues> = React.ComponentProps<typeof FormProvider<T>> & { schema?: z.ZodTypeAny; };

export const Form = <T extends FieldValues>(
  { schema, ...props }: FormProps<T>
) => (
  <FormSchemaContext.Provider value={schema ?? null}>
    <FormProvider {...props} />
  </FormSchemaContext.Provider>
);

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

// Unwraps ZodEffects (.refine(), .transform(), .superRefine())
function unwrapEffects(schema: ZodTypeAny): ZodTypeAny {
  let current = schema;
  while (current instanceof z.ZodEffects) {
    current = current._def.schema;
  }
  return current;
}

function resolveField(schema: ZodTypeAny, path: string): ZodTypeAny | null {
  let current = unwrapEffects(schema);
  for (const key of path.split(".")) {
    current = unwrapEffects(current);

    if (!(current instanceof z.ZodObject)) {
      return null;
    }

    const next = current.shape[key];
    if (!next) {
      return null;
    }
    current = next;
  }
  return current;
}

function isFieldRequired(schema: ZodTypeAny | null, name: string): boolean {
  if (!schema) {
    return false;
  }
  const field = resolveField(schema, name);
  return field !== null && !field.isOptional();
}

interface FormLabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export const FormLabel = React.forwardRef<
  React.ElementRef<'label'>,
  React.ComponentPropsWithoutRef<'label'> & FormLabelProps
>(({ className, children, ...props }, ref) => {
  const { error, formItemId, name } = useFormField();
  const schema = React.useContext(FormSchemaContext);
  const required = isFieldRequired(schema, name);

  return (
    <label
      ref={ref}
      className={classNames(styles.label, error && styles.error, className)}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {required && <span className={styles.required}>*</span>}
    </label>
  );
});
FormLabel.displayName = 'FormLabel';

export const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <p ref={ref} id={formDescriptionId} className={classNames(styles.description, className)} {...props} />;
  },
);
FormDescription.displayName = 'FormDescription';

export const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...props}
      />
    );
  },
);
FormControl.displayName = 'FormControl';

export const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const { t, i18n } = useTranslation();
    const message = error ? String(error?.message) : children;
    const body = typeof message === 'string' && i18n.exists(message) ? t(message) : message;

    if (!body) {
      return null;
    }

    return (
      <p ref={ref} id={formMessageId} className={classNames(styles.error, className)} {...props}>
        {body}
      </p>
    );
  },
);
FormMessage.displayName = 'FormMessage';
