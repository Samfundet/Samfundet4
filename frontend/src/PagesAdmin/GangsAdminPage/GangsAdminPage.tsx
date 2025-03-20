import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { type Tab, TabBar } from '~/Components/TabBar/TabBar';
import { Table } from '~/Components/Table';
import { getOrganizedGangList } from '~/api';
import type { GangTypeDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function GangsAdminPage() {
  const navigate = useNavigate();
  const [gangTypes, setGangs] = useState<GangTypeDto[]>([]);
  const [currentGangTypeTab, setGangTypeTab] = useState<Tab<GangTypeDto> | undefined>(undefined);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  useTitle(t(KEY.adminpage_gangs_title));

  // Stuff to do on first render.
  // TODO add permissions on render
  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  useEffect(() => {
    getOrganizedGangList()
      .then((data) => {
        setGangs(data);
        setShowSpinner(false);
        setGangTypeTab({
          key: data[0].id,
          label: dbT(data[0], 'title') ?? '?',
          value: data[0],
        });
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }, []);

  const gangTypeTabs: Tab<GangTypeDto>[] = gangTypes.map((gangType) => {
    return {
      key: gangType.id,
      label: dbT(gangType, 'title') ?? '?',
      value: gangType,
    };
  });

  const currentGangType = currentGangTypeTab?.value;

  const tableData = currentGangType?.gangs.map((element2) => ({
    cells: [
      dbT(element2, 'name'),
      element2.abbreviation,
      element2.webpage,
      {
        content: (
          <CrudButtons
            onEdit={() => {
              navigate(
                reverse({
                  pattern: ROUTES.frontend.admin_gangs_edit,
                  urlParams: { gangId: element2.id },
                }),
              );
            }}
          />
        ),
      },
    ],
  }));

  const title = t(KEY.adminpage_gangs_title);
  const backendUrl = ROUTES.backend.admin__samfundet_gang_changelist;
  const header = (
    <Button theme="success" rounded={true} onClick={() => navigate(ROUTES.frontend.admin_gangs_create)}>
      {t(KEY.adminpage_gangs_create)}
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <TabBar tabs={gangTypeTabs} selected={currentGangTypeTab} onSetTab={setGangTypeTab} />
      <br />
      {currentGangType && (
        <>
          <Table
            columns={[
              t(KEY.common_gang) ?? '',
              t(KEY.admin_gangsadminpage_abbreviation) ?? '',
              t(KEY.admin_gangsadminpage_webpage) ?? '',
              '',
            ]}
            data={tableData ?? []}
          />
        </>
      )}
    </AdminPageLayout>
  );
}
