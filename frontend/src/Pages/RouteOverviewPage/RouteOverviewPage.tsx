import { useState } from 'react';
import { Button, Link, Page } from '~/Components';
import { ROUTES } from '~/routes';
import { downloadFrontendRoutesJson } from '~/routes/export';

type RouteEntry = {
  name: string;
  path: string;
};

function collectRouteEntries(routes: unknown, parentName = ''): RouteEntry[] {
  if (typeof routes !== 'object' || routes === null) {
    return [];
  }

  const entries: RouteEntry[] = [];

  for (const [name, value] of Object.entries(routes)) {
    const fullName = parentName ? `${parentName}.${name}` : name;

    if (typeof value === 'string') {
      entries.push({ name: fullName, path: value });
      continue;
    }

    entries.push(...collectRouteEntries(value, fullName));
  }

  return entries;
}

export function RouteOverviewPage() {
  const [showName, setShowName] = useState(false);

  return (
    <Page>
      <Button onClick={() => setShowName(!showName)}>Toggle name</Button>
      <Button onClick={() => downloadFrontendRoutesJson()}>Export frontend routes (JSON)</Button>

      <h1>Routes</h1>
      <br />

      {Object.entries(ROUTES).map((domainRouteObj) => {
        const domain = domainRouteObj[0];
        const domainRoutes = domainRouteObj[1];
        const routeEntries = collectRouteEntries(domainRoutes);

        return (
          <div key={domain}>
            <h2>{domain}:</h2>
            <br />
            {routeEntries.map((routeEntry) => {
              const displayName = showName ? routeEntry.name : routeEntry.path;
              return (
                <span key={routeEntry.name}>
                  <Link url={routeEntry.path}>{displayName}</Link>
                  <br />
                </span>
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
