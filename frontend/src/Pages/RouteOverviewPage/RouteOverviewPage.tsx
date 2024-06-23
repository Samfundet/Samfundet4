import { useState } from 'react';
import { Button, Link } from '~/Components';
import { ROUTES } from '~/routes';

export function RouteOverviewPage() {
  const [showName, setShowName] = useState(false);

  return (
    <>
      <Button onClick={() => setShowName(!showName)}>Toggle name</Button>

      <h1>Routes</h1>
      <br />

      {Object.entries(ROUTES).map((domainRouteObj) => {
        const domain = domainRouteObj[0];
        const domainRoutes = domainRouteObj[1];

        return (
          <div key={domain}>
            <h2>{domain}:</h2>
            <br />
            {Object.entries(domainRoutes).map((routes) => {
              const routeName = routes[0];
              const route = routes[1];
              const displayName = showName ? routeName : route;
              return (
                <span key={route}>
                  <Link url={route}>
                    {displayName}
                  </Link>
                  <br />
                </span>
              );
            })}
            <br />
            <br />
          </div>
        );
      })}
    </>
  );
}
