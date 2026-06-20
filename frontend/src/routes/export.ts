import { ROUTES } from './index';

export type FrontendRouteExport = {
  name: keyof typeof ROUTES.frontend;
  path: (typeof ROUTES.frontend)[keyof typeof ROUTES.frontend];
};

export function getFrontendRoutesForExport(): FrontendRouteExport[] {
  return Object.entries(ROUTES.frontend).map(([name, path]) => ({
    name: name as keyof typeof ROUTES.frontend,
    path: path as (typeof ROUTES.frontend)[keyof typeof ROUTES.frontend],
  }));
}

export function getFrontendRoutesExportJson(pretty = true): string {
  return JSON.stringify(getFrontendRoutesForExport(), null, pretty ? 2 : 0);
}

export function downloadFrontendRoutesJson(fileName = 'frontend-routes.json'): void {
  const json = getFrontendRoutesExportJson();
  const blob = new Blob([json], { type: 'application/json' });
  const objectUrl = URL.createObjectURL(blob);

  try {
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
