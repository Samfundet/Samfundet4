import { GangDto, RecruitmentPositionDto } from '~/dto';
import { useEffect, useState } from 'react';
import { getActiveRecruitmentPositions } from '~/api';
import { Button, SamfundetLogoSpinner } from '~/Components';
import { ROUTES } from '~/routes';
import { reverse } from '~/named-urls';
import { useNavigate } from 'react-router-dom';
import styles from './PositionTable.module.scss';

type PositionsTableProps = {
  currentSelectedGang: GangDto | undefined;
};

export function PositionsTable({ currentSelectedGang }: PositionsTableProps) {
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState<RecruitmentPositionDto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentSelectedGang) {
      return;
    }
    //TODO: filter recruitment positions on gang id in backend? DO IN ISSUE #1121
    getActiveRecruitmentPositions()
      .then((response) => {
        const filteredPositions = response.data.filter((pos) => pos.gang.id === currentSelectedGang.id);
        setPositions(filteredPositions);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
    console.log('useEffect');
  }, [currentSelectedGang]);

  const positionsTable = (positions: RecruitmentPositionDto[]) => {
    return (
      <table className={styles.recruitmentTable}>
        <thead>
          <tr>
            <th>Verv</th>
            <th>Beskrivelse</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.id}>
              <td>
                <Button
                  theme={'samf'}
                  className={styles.positionButton}
                  disabled={loading}
                  onClick={() => {
                    navigate(
                      reverse({
                        pattern: ROUTES.frontend.recruitment_application,
                        urlParams: { positionID: position.id, gangID: position.id },
                      }),
                    );
                  }}
                >
                  {position.name_nb}
                </Button>
              </td>
              <td>{position.short_description_nb}</td>
              <td>{position.is_funksjonaer_position ? 'Funksjonær' : 'Gjengis'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  return (
    <div className={styles.recruitmentTableContainer}>
      {loading ? <SamfundetLogoSpinner /> : positions ? <div> {positionsTable(positions)}</div> : <p>Ingen verv</p>}
    </div>
  );
}
