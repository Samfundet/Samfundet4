import { Alerts } from './Components/Alerts';
import { BannerLock } from './Components/BannerLock';

export function HomePage() {
  return (
    <div>
      <BannerLock />
      <Alerts />
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
