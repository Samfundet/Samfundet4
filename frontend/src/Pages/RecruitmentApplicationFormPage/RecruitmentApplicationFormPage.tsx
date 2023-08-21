import { useEffect, useState } from 'react';
import { Page, SamfundetLogoSpinner } from '~/Components';
import { getRecruitmentPosition } from '~/api';
import { RecruitmentPositionDto } from '~/dto';
import { dbT } from '~/utils';
import styles from './RecruitmentApplicationFormPage.module.scss';

export function RecruitmentApplicationFormPage() {
  const [recruitmentPosition, setRecruitmentPosition] = useState<RecruitmentPositionDto>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecruitmentPosition('1').then((res) => {
      setRecruitmentPosition(res.data);
      console.log(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return (
    <Page>
      <div className={styles.container}>
        <h1>{dbT(recruitmentPosition, 'name')}</h1>
      </div>
    </Page>
  );
}
