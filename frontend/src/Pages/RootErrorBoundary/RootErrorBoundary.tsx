import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { ErrorDisplay } from '~/Components';
import { KEY } from '~/i18n/constants';

export function RootErrorBoundary() {
  const { t } = useTranslation();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <ErrorDisplay header={t(KEY.error_not_found)} message={t(KEY.error_not_found_description)} />;
    }
    if (error.status === 403) {
      return <ErrorDisplay header={t(KEY.error_forbidden)} message={t(KEY.error_forbidden_description)} />;
    }
    if (error.status === 500) {
      return <ErrorDisplay header={t(KEY.error_server_error)} message={t(KEY.error_server_error_description)} />;
    }
  }

  return <ErrorDisplay header={t(KEY.error_generic)} message={t(KEY.error_generic_description)} />;
}
