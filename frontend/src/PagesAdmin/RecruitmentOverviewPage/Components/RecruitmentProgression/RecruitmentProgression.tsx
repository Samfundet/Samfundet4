import styles from './RecruitmentProgression.module.scss';
import { Text } from '~/Components/Text/Text';
import { useEffect, useState } from 'react';
import { ProgressBar, Button } from '~/Components';
import { Table, TableRow } from '~/Components/Table';

export function RecruitmentProgression() {
  const [progression, setProgression] = useState<number>();
  const [processedApplication, setProcessesApplications] = useState<number>(-1);
  const [totalApplications, setTotalApplications] = useState<number>(-1);
  const [rejectionCount, setRejectionCount] = useState<number>(-1);
  const [admissionCount, setAdmissionCount] = useState<number>(-1); //disse får verv
  const [tableRows, setTableRowsState] = useState<TableRow[]>([]);
  const mock_fetched_data = [
    { team: 'Markedsføringsgjenge', applications: 20, processed: 10, admitted: 5, rejected: 5 },
    { team: 'Kafe og Serveringsgjenge', applications: 15, processed: 15, admitted: 8, rejected: 7 },
  ];
  //http://localhost:3000/control-panel/recruitment/:recruitmentId/recruitment-overview/
  useEffect(() => {
    //TODO: add dynamic data

    const totalApps = mock_fetched_data.reduce((sum, current) => sum + current.applications, 0);
    const totalProcessed = mock_fetched_data.reduce((sum, current) => sum + current.processed, 0);
    const totalAdmitted = mock_fetched_data.reduce((sum, current) => sum + current.admitted, 0);
    const totalRejected = mock_fetched_data.reduce((sum, current) => sum + current.rejected, 0);

    setTotalApplications(totalApps);
    setProcessesApplications(totalProcessed);
    setAdmissionCount(totalAdmitted);
    setRejectionCount(totalRejected);

    if (totalApplications > 0 && processedApplication >= 0) {
      setProgression(processedApplication / totalApplications);
    } else {
      setProgression(undefined);
    }

    setTableRows();
  }, [processedApplication, totalApplications]);

  const setTableRows = () => {
    const rows: TableRow[] = mock_fetched_data.map((item) => [
      {
        content: (
          <Button theme={'samf'} className={styles.gangButton} onClick={() => alert('navigate to gjengopptak')}>
            {item.team}
          </Button>
        ),
        value: item.team,
      },
      item.applications,
      item.processed,
      item.admitted,
      item.rejected,
    ]);
    setTableRowsState(rows);
  };
  const toPercentage = (floatNum: number | undefined) => {
    if (floatNum) {
      const percentage = floatNum * 100;
      return percentage.toString().slice(0, 4) + '%';
    } else {
      return 'N/A';
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.progressBarContainer}>
        <span>{toPercentage(progression)}</span>
        <ProgressBar max={1} value={progression} className={styles.progressBar} />
      </div>
      <div className={styles.gridWrapper}>
        <div className={styles.progressReport}>
          <Text as={'p'} size={'m'}>
            Totalt har {processedApplication} av {totalApplications} søknader blitt behandlet
          </Text>
          <Text as={'p'} size={'m'}>
            Totalt vil {admissionCount} av {totalApplications} søkere bli tatt opp og {rejectionCount} få avslag.
          </Text>
        </div>
        <div className={styles.avslagsepostContainer}>
          <Text size={'l'} as={'strong'}>
            Avslagsepost
          </Text>
          <Text size={'m'} as={'p'}>
            0 avslagseposter har blitt sendt for dette opptaket.
          </Text>
          {progression < 1 ? (
            <Text size={'m'} as={'strong'}>
              Alle søknader er enda ikke behandlet. Det er derfor ikke mulig å sende avslagsepost enda. *TIL WEEB: EN
              KNAPP BLIR SYNLIG HER NÅ ALLE SØKNADER HAR BLITT PROSESSERT*
            </Text>
          ) : (
            <Button
              theme={'samf'}
              onClick={() => {
                alert('Skal navigere til siden hvor man lager avslagsepost');
              }}
            >
              'TODO NAVIGATE' Lag avslagsepost
            </Button>
          )}
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table columns={['Gjeng', 'Søknader', 'Behandlet', 'Tatt opp', 'Avslag']} data={tableRows} />
      </div>
    </div>
  );
}
