import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  Alert,
  Button,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { MultiSelect } from '~/Components/MultiSelect';
import { createRole, editRole, getPermissions } from '~/api';
import type { RoleDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { permissionKeys } from '~/queryKeys';
import { ROLE_CONTENT_TYPE, ROLE_NAME } from '~/schema/role';
import styles from './RoleForm.module.scss';

const schema = z.object({
  name: ROLE_NAME,
  permissions: z.array(z.number()),
  content_type: ROLE_CONTENT_TYPE.nullish(),
});

type SchemaType = z.infer<typeof schema>;

type ContentTypeSchemaType = z.infer<typeof ROLE_CONTENT_TYPE>;

type Props = {
  role?: RoleDto;
};

export function RoleForm({ role }: Props) {
  const { t } = useTranslation();

  const {
    data: allPermissions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: permissionKeys.all,
    queryFn: getPermissions,
  });

  const edit = useMutation({
    mutationFn: editRole,
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
    },
  });

  const create = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      toast.success(t(KEY.common_creation_successful));
    },
  });

  const isPending = edit.isPending || create.isPending;

  const permissionOptions = useMemo<DropdownOption<number>[]>(() => {
    if (!allPermissions) {
      return [];
    }
    return allPermissions.map((p) => ({
      value: p.id,
      label: p.name,
    }));
  }, [allPermissions]);

  const selectedPermissions = useMemo<DropdownOption<number>[]>(() => {
    if (!allPermissions || !role) {
      return [];
    }
    const permissions = allPermissions.filter((p) => role.permissions.includes(p.id));
    return permissions.map((p) => ({
      value: p.id,
      label: p.name,
    }));
  }, [role, allPermissions]);

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role?.name ?? '',
      permissions: role?.permissions ?? [],
      content_type: (role?.content_type ?? '') as ContentTypeSchemaType,
    },
  });

  function onSubmit(values: SchemaType) {
    console.log(values);
    if (role) {
      edit.mutate({ id: role.id, ...values });
    } else {
      create.mutate(values);
    }
  }

  const contentTypeLabels: Record<ContentTypeSchemaType, string> = {
    '': t(KEY.common_any),
    organization: t(KEY.recruitment_organization),
    gang: t(KEY.common_gang),
    section: t(KEY.common_section),
  };

  const contentTypeOptions: DropdownOption<ContentTypeSchemaType>[] = ROLE_CONTENT_TYPE.options.map((ct) => ({
    value: ct,
    label: contentTypeLabels[ct],
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(KEY.common_name)}</FormLabel>
              <FormControl>
                <Input type="text" disabled={isLoading || isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="content_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(KEY.role_content_type)}</FormLabel>
              <FormControl>
                <Dropdown options={contentTypeOptions} disabled={isLoading || isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="permissions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(KEY.common_permissions)}</FormLabel>
              <FormControl>
                {isLoading ? (
                  <span>{t(KEY.common_loading)}...</span>
                ) : isError ? (
                  <Alert message={t(KEY.role_edit_could_not_load_permissions)} type="error" />
                ) : (
                  <MultiSelect options={permissionOptions} selected={selectedPermissions} {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={styles.action_row}>
          <Button type="submit" theme="green" disabled={isLoading || isPending}>
            {t(KEY.common_save)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
