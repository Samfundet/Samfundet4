import { useEffect, useState } from 'react';
import { getSaksdokumenter } from '~/api';
import { SamfundetLogoSpinner } from '~/Components';
import { SaksdokumentDto } from '~/dto';
import styles from './SaksdokumenterPage.module.scss';

export function SaksdokumenterPage() {
  const [loading, setLoading] = useState(true);
  const [saksdokumenter, setSaksdokumenter] = useState<SaksdokumentDto[]>();
  useEffect(() => {
    getSaksdokumenter().then((data) => {
      setLoading(false);
      setSaksdokumenter(data);
    });
  }, []);
  return loading ? (
    <div className={styles.container}>
      <SamfundetLogoSpinner />
    </div>
  ) : (
    <div className={styles.container}>
      {saksdokumenter && saksdokumenter.map((saksdokument) => <h1 key={saksdokument.id}>{saksdokument.title_no}</h1>)}
    </div>
  );
}
