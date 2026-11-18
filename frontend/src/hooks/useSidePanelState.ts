import { useState } from 'react';
import { CONTROL_PANEL_SIDEPANEL_KEY } from '~/constants';
import { useMobile } from './useMobile';

/**
 * Handles control panel sidepanel open/minimize state.
 * Persisted in localStorage
 */
export function useSidePanelState(): [boolean, (open: boolean) => void] {
  const isMobile = useMobile();
  const [isOpen, setOpenState] = useState(
    (localStorage.getItem(CONTROL_PANEL_SIDEPANEL_KEY) || 'open') === 'open' && !isMobile,
  );

  function setPanelOpen(open: boolean) {
    localStorage.setItem(CONTROL_PANEL_SIDEPANEL_KEY, open ? 'open' : 'minimized');
    setOpenState(open);
  }

  return [isOpen, setPanelOpen];
}
