import { useState } from 'react';
import { Button, Link, Page } from '~/Components';
import { ROUTES } from '~/routes';

export function RouteOverviewPage() {
  const [showName, setShowName] = useState(false);

  return (
    <Page>
      <Button onClick={() => setShowName(!showName)}>Toggle name</Button>

      <h1>Routes</h1>
      <br />

      {Object.entries(ROUTES).map((domainRouteObj, index) => {
        const domain = domainRouteObj[0];
        const domainRoutes = domainRouteObj[1];

        return (
          <div key={index}>
            <h2>{domain}:</h2>
            <br />
            {Object.entries(domainRoutes).map((routes, index) => {
              const routeName = routes[0];
              const route = routes[1];
              const displayName = showName ? routeName : route;
              return (
                <>
                  <Link key={index} url={route}>
                    {displayName}
                  </Link>
                  <br />
                </>
              );
            })}
            <br />
            <br />
          </div>
        );
      })}
    </Page>
  );
}
