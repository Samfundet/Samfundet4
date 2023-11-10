import { useEffect, useState } from 'react';
import { Page, SamfundetLogoSpinner, Video } from '~/Components';
import { getActiveRecruitmentPositions, getGangList } from '~/api';
import { GangTypeDto, RecruitmentPositionDto } from '~/dto';
import { ROUTES } from '~/routes';
import { GangTypeContainer } from './Components';
import styles from './RecruitmentPage.module.scss';

export function RecruitmentPage() {
  const [recruitmentPositions, setRecruitmentPositions] = useState<RecruitmentPositionDto[]>();
  const [loading, setLoading] = useState(true);
  const [gangTypes, setGangs] = useState<GangTypeDto[]>();

  useEffect(() => {
    Promise.all([getActiveRecruitmentPositions(), getGangList()])
      .then(([recruitmentRes, gangsRes]) => {
        setRecruitmentPositions(recruitmentRes.data);
        setGangs(gangsRes);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Page>
      <div className={styles.container}>
        <Video embedId="-nYQb8_TvQ4" className={styles.video}></Video>
        {loading ? (
          <SamfundetLogoSpinner />
        ) : (
          <GangTypeContainer gangTypes={gangTypes} recruitmentPositions={recruitmentPositions} />
        )}
      </div>
      <div className={styles.heileshiten}>
        <div>
          <h1 className={styles.header}>Det er for tiden ingen opptak på Samfundet</h1>
        </div>

        <div className={styles.info}>
          <p>
            <br />
            Vi har opptak på starten av hvert semester og ønsker at du søker til oss som frivillig!
            <br />
            Studentersamfundet i Trondhjem er Norges største studentersamfund og vi har et tilbud andre byer bare kan
            drømme om.
            <br />
            Nesten uansett hvilken studiebakgrunn eller interesser du har, så finnes det en frivillig gjeng som søker
            nettopp deg!
            <br />
            <br />
            Over 1000 studenter bidrar allerede frivillig! Du kan være med å jobbe med blant annet lyd, lys, teater,
            snekring, IT, artistbooking, korsang, musikk og mye annet. Du kan lære mye av å jobbe på Samfundet, og du
            blir garantert kjent med mange andre studenter.
            <br />
            For mer informasjon om samfundets gjenger{' '}
            <strong>
              <a className={styles.link} href={ROUTES.other.samfundet_kontaktinfo}>
                Klikk her.
              </a>
            </strong>
            <br />
            Hvis du allerede har søkt kan du logge inn som søker for å prioritere og følge med på dine søknader.
          </p>
        </div>
      </div>
    </Page>
  );
}
