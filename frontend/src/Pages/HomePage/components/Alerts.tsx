import { useEffect, useState } from 'react';
import { Alert } from '~/Components';
import { AlertType } from '~/types';

export function Alerts() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  //TODO: replace with backend and look into how billig alerts work
  useEffect(() => {
    const tempAlerts: AlertType[] = [{ message: 'test Alert', type: 'samf', align: 'center' }];
    setAlerts(tempAlerts);
  }, []);

  return (
    <div>
      {alerts.map((alert, index) => (
        <Alert {...alert} key={index} />
      ))}
    </div>
  );
}
