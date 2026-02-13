import { Icon } from '@iconify/react';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { Button, Link, Navbar } from '~/Components';
import { appletCategories } from '~/Pages/AdminPage/applets';
import { logout, stopImpersonatingUser } from '~/api';
import { isSiteFeatureEnabled } from '~/constants/site-features';
import { useAuthContext } from '~/context/AuthContext';
import { useMobile } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import type { AdminApplet } from '~/types';
import { dbT } from '~/utils';
import styles from './AdminLayout.module.scss';
import { AdminLayout } from '../AdminLayout';

export function MDBConnectFormAdminPage() {
    return <div>Her ska en vakker form komme</div>
}