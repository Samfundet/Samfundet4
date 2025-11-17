import { useCallback, useState } from 'react';
import type { BadgeType } from '~/Components/Badge/Badge';

export interface DynamicBadgeState {
  show: boolean;
  type: BadgeType;
  text: string;
}

export interface DynamicBadgeOptions {
  defaultDuration?: number;
  onShow?: (state: DynamicBadgeState) => void;
  onHide?: () => void;
}

export interface UseDynamicBadgeReturn {
  badgeState: DynamicBadgeState;
  showBadge: (type: BadgeType, text: string, duration?: number) => void;
  hideBadge: () => void;
  showSuccess: (text: string, duration?: number) => void;
  showError: (text: string, duration?: number) => void;
  showWarning: (text: string, duration?: number) => void;
  showInfo: (text: string, duration?: number) => void;
  isVisible: boolean;
}

/**
 * Custom hook for managing dynamic badge state with auto-hide functionality
 *
 * @param options - Configuration options for the badge behavior
 * @returns Object with badge state and control functions
 *
 * @example
 * ```tsx
 * const { badgeState, showSuccess, showError } = useDynamicBadge({
 *   defaultDuration: 3000
 * });
 *
 * // Show success message
 * showSuccess('Data saved successfully!');
 *
 * // Show error with custom duration
 * showError('Something went wrong', 5000);
 *
 * // Render the badge
 * {badgeState.show && (
 *   <Badge
 *     text={badgeState.text}
 *     type={badgeState.type}
 *     animated={true}
 *   />
 * )}
 * ```
 */
export function useDynamicBadge(options: DynamicBadgeOptions = {}): UseDynamicBadgeReturn {
  const { defaultDuration = 3000, onShow, onHide } = options;

  const [badgeState, setBadgeState] = useState<DynamicBadgeState>({
    show: false,
    type: 'information',
    text: '',
  });

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const hideBadge = useCallback(() => {
    setBadgeState((prev) => ({ ...prev, show: false }));
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    onHide?.();
  }, [timeoutId, onHide]);

  const showBadge = useCallback(
    (type: BadgeType, text: string, duration: number = defaultDuration) => {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newState: DynamicBadgeState = { show: true, type, text };
      setBadgeState(newState);
      onShow?.(newState);

      // Set new timeout for auto-hide
      if (duration > 0) {
        const newTimeoutId = setTimeout(() => {
          hideBadge();
        }, duration);
        setTimeoutId(newTimeoutId);
      }
    },
    [defaultDuration, timeoutId, hideBadge, onShow],
  );

  // Convenience methods for common badge types
  const showSuccess = useCallback(
    (text: string, duration?: number) => {
      showBadge('success', text, duration);
    },
    [showBadge],
  );

  const showError = useCallback(
    (text: string, duration?: number) => {
      showBadge('error', text, duration ?? defaultDuration * 1.67); // Errors show longer by default
    },
    [showBadge, defaultDuration],
  );

  const showWarning = useCallback(
    (text: string, duration?: number) => {
      showBadge('warning', text, duration);
    },
    [showBadge],
  );

  const showInfo = useCallback(
    (text: string, duration?: number) => {
      showBadge('information', text, duration);
    },
    [showBadge],
  );

  return {
    badgeState,
    showBadge,
    hideBadge,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    isVisible: badgeState.show,
  };
}
