import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, SamfundetLogoSpinner, Table, Text } from '~/Components';
import { getRecruitmentPositionsGangForApplicant } from '~/api';
import { useOrganizationContext } from '~/context/OrgContextProvider';
import type { GangDto, RecruitmentPositionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './PositionsTable.module.scss';

type PositionsTableProps = {
  currentSelectedGang: GangDto | undefined;
  setLoading: (loading: boolean) => void;
  loading: boolean;
};

export function PositionsTable({ currentSelectedGang, setLoading, loading }: PositionsTableProps) {
  const [positions, setPositions] = useState<RecruitmentPositionDto[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const recruitmentId = useParams();
  const { organizationTheme } = useOrganizationContext();

  useEffect(() => {
    if (!currentSelectedGang || !recruitmentId.recruitmentId) {
      return;
    }
    setLoading(true);
    getRecruitmentPositionsGangForApplicant(recruitmentId.recruitmentId, currentSelectedGang.id)
      .then((response) => {
        setPositions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [currentSelectedGang, recruitmentId, setLoading]);

  const tableColumns = [
    { content: t(KEY.common_name), sortable: true },
    { content: t(KEY.common_description), sortable: false },
    { content: t(KEY.category), sortable: false },
  ];
  const tableData = positions.map((item) => {
    const positionPageURL = reverse({
      pattern: ROUTES.frontend.recruitment_application,
      urlParams: { positionId: item.id, gangId: item.id },
    });
    return {
      cells: [
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
              {dbT(item, 'name') ?? 'N/A'}
            </Button>
          ),
        },
        {
          content: (
            <Text as="p" size="m">
              {' '}
              {dbT(item, 'short_description') ?? 'N/A'}
            </Text>
          ),
        },
        {
          content: (
            <Text>{item.is_funksjonaer_position ? t(KEY.recruitment_funksjonaer) : t(KEY.recruitment_gangmember)}</Text>
          ),
        },
      ],
    };
  });
  return (
    <div className={styles.recruitmentTableContainer}>
      {loading ? (
        <SamfundetLogoSpinner />
      ) : positions.length > 0 ? (
        <Table columns={tableColumns} data={tableData} />
      ) : (
        <Text as="strong" size="l">
          {t(KEY.recruitment_no_positions)}
        </Text>
      )}
    </div>
  );
}
