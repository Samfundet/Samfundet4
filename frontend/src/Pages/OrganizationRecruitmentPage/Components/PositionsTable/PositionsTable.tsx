import { GangDto, RecruitmentPositionDto } from '~/dto';
import { useEffect, useState } from 'react';
import { getRecruitmentPositionsGang } from '~/api';
import { Button, SamfundetLogoSpinner, Text, Table } from '~/Components';
import { ROUTES } from '~/routes';
import { reverse } from '~/named-urls';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './PositionsTable.module.scss';
import { KEY } from '~/i18n/constants';
import { useTranslation } from 'react-i18next';
import { dbT } from '~/utils';
import { useOrganizationContext } from '~/context/OrgContextProvider';

type PositionsTableProps = {
  currentSelectedGang: GangDto | undefined;
  setLoading: (loading: boolean) => void;
  loading: boolean;
};

export function PositionsTable({ currentSelectedGang, setLoading, loading }: PositionsTableProps) {
  const [positions, setPositions] = useState<RecruitmentPositionDto[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const recruitmentID = useParams().recruitmentID;
  const { organizationTheme } = useOrganizationContext();

  useEffect(() => {
    if (!currentSelectedGang || !recruitmentID) {
      return;
    }
    setLoading(true);
    getRecruitmentPositionsGang(recruitmentID, currentSelectedGang.id)
      .then((response) => {
        setPositions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [currentSelectedGang, recruitmentID, setLoading]);

  const tableColumns = [
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_description), sortable: false },
    { content: t(KEY.category), sortable: false },
  ];
  const tableData = positions.map(function (item) {
    const positionPageURL = reverse({
      pattern: ROUTES.frontend.recruitment_application,
      urlParams: { positionID: item.id, gangID: item.id },
    });
    return [
      {
        content: (
          <Button
            theme={organizationTheme?.buttonTheme}
            className={styles.positionButton}
            disabled={loading}
            onClick={() => {
              navigate(positionPageURL);
            }}
          >
            {dbT(item, 'name')}
          </Button>
        ),
      },
      {
        content: (
          <Text as={'p'} size={'m'}>
            {' '}
            {dbT(item, 'short_description')}
          </Text>
        ),
      },
      {
        content: (
          <Text>{item.is_funksjonaer_position ? t(KEY.recruitment_funksjonaer) : t(KEY.recruitment_gangmember)}</Text>
        ),
      },
    ];
  });
  return (
    <div className={styles.recruitmentTableContainer}>
      {loading ? (
        <SamfundetLogoSpinner />
      ) : positions.length > 0 ? (
        <Table columns={tableColumns} data={tableData} />
      ) : (
        <Text as={'strong'} size={'l'}>
          {t(KEY.recruitment_no_positions)}
        </Text>
      )}
    </div>
  );
}
