import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
import type { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { MultiSelect } from '~/Components/MultiSelect';
import { getPermissions } from '~/api';
import type { RoleDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROLE_CONTENT_TYPE } from '~/schema/role';
import styles from './RoleForm.module.scss';

const schema = z.object({
  name: z.string(),
  permissions: z.array(z.number()),
  content_type: ROLE_CONTENT_TYPE,
});

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
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });

  const permissionOptions = useMemo<DropDownOption<number>[]>(() => {
    if (!allPermissions) {
      return [];
    }
    return allPermissions.map((p) => ({
      value: p.id,
      label: p.name,
    }));
  }, [allPermissions]);

  const selectedPermissions = useMemo<DropDownOption<number>[]>(() => {
    if (!allPermissions || !role) {
      return [];
    }
    const permissions = allPermissions.filter((p) => role.permissions.includes(p.id));
    return permissions.map((p) => ({
      value: p.id,
      label: p.name,
    }));
  }, [role, allPermissions]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role?.name ?? '',
      permissions: role?.permissions ?? [],
      content_type: (role?.content_type ?? '') as z.infer<typeof ROLE_CONTENT_TYPE>,
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
  }

  const contentTypeLabels: Record<z.infer<typeof ROLE_CONTENT_TYPE>, string> = {
    '': '',
    Organization: t(KEY.recruitment_organization),
    Gang: t(KEY.common_gang),
    Section: t(KEY.common_section),
  };

  const contentTypeOptions: DropDownOption<z.infer<typeof ROLE_CONTENT_TYPE>>[] = ROLE_CONTENT_TYPE.options.map(
    (ct) => ({
      value: ct,
      label: contentTypeLabels[ct],
    }),
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(KEY.common_name)}</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Dropdown options={contentTypeOptions} {...field} />
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
                  <MultiSelect<number> options={permissionOptions} selected={selectedPermissions} {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={styles.action_row}>
          <Button type="submit" theme="green">
            {t(KEY.common_save)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
