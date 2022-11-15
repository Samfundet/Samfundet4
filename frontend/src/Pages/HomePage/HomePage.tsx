import styles from './HomePage.module.scss';

export function HomePage() {
  return (
    <div className={styles.containter}>
      <div>
        <h1>BannerLock</h1>
      </div>
      <div>
        <h3>Alert</h3>
      </div>
      <div>
        <div>
          <h2>Hva skjer</h2>
        </div>
        <div>
          <h2>Åpningstider</h2>
        </div>
      </div>
      <div>
        <h1>Arrangmenter</h1>
      </div>
    </div>
  );
}
