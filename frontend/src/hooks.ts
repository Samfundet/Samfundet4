import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTextItem, putUserPreference } from '~/api';
import { Key, SetState } from '~/types';
import { createDot, dbT, hasPerm, isTruthy, lowerCapitalize, updateBodyThemeClass } from '~/utils';
import { LinkTarget } from './Components/Link/Link';
import { BACKEND_DOMAIN, desktopBpLower, mobileBpUpper, THEME, THEME_KEY, ThemeValue } from './constants';
import { useAuthContext } from './context/AuthContext';
import { useGlobalContext } from './context/GlobalContextProvider';
import { TextItemDto } from './dto';
import { KEY, LANGUAGES } from './i18n/constants';

// Make typescript happy.
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    goatcounter: any;
  }
}

/**
 * Hook to track all url changes.
 * https://tebza.dev/how-to-add-privacy-friendly-analytics-to-nextts
 */
export function useGoatCounter(): void {
  const location = useLocation();

  useEffect(() => {
    if (window.goatcounter === undefined) return;
    const path = location.pathname + location.search + location.hash;
    window.goatcounter.count({ path: path });
    console.log(`GoatCounter tracked path: ${path}`);
  }, [location]);
}

/**
 * Return true while on desktop width, false otherwise
 */
export function useDesktop(): boolean {
  const [width, setWidth] = useState(window.innerWidth);
  const updateMedia = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  return width > desktopBpLower;
}

/**
 * @returns true if mobile, false otherwise
 */
export function useMobile(): boolean {
  const [width, setWidth] = useState(window.innerWidth);
  const updateMedia = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  return width < mobileBpUpper;
}

/**
 *  Hook that returns the correct translation for given key
 */
export function useTextItem(key: string, language?: string): string | undefined {
  const [textItem, setTextItem] = useState<TextItemDto>();
  const { i18n } = useTranslation();
  const isNorwegian = (language || i18n.language) === LANGUAGES.NB;
  useEffect(() => {
    getTextItem(key).then((data) => {
      setTextItem(data);
    });
  }, [key]);
  return isNorwegian ? textItem?.text_nb : textItem?.text_en;
}

/**
 * Scroll detection hook
 * @returns the current y scroll
 */
export function useScrollY(): number {
  const [scrollY, setScrollY] = useState(window.scrollY);
  useEffect(() => {
    function handleNavigation(e: Event) {
      const target = e.currentTarget as Window;
      if (target != null) {
        setScrollY(window.scrollY);
      }
    }
    window.addEventListener('scroll', handleNavigation);
    return () => {
      window.removeEventListener('scroll', handleNavigation);
    };
  }, []);
  return scrollY;
}

/**
 * Element offset from screen center (id of html element)
 * @param id id of the html element
 * @returns pixel offset from centre of screen
 */
export function useScreenCenterOffset(id: string): number {
  const element = document.getElementById(id);
  const rect = element?.getBoundingClientRect();
  const [positionY, setPositionY] = useState(rect?.y ?? 0);

  useEffect(() => {
    function handleNavigation(e: Event) {
      const target = e.currentTarget;
      if (target != null) {
        const element = document.getElementById(id);
        const rect = element?.getBoundingClientRect();
        if (rect != null) {
          const centerScreen = window.innerHeight / 2;
          const centerEl = rect.y + rect.height / 2;
          setPositionY(centerEl - centerScreen);
        }
      }
    }
    window.addEventListener('scroll', handleNavigation);
    return () => {
      window.removeEventListener('scroll', handleNavigation);
    };
  }, [id]);
  return positionY;
}

/**
 * Utility hook to get the previous value of react state
 * @param value current state
 * @returns previous state after next render
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/**
 * Shorthand to check if current user has a given permission.
 */
export function usePermission(permission: string, obj?: string | number): boolean {
  const { user } = useAuthContext();
  const hasPermission = hasPerm({ permission: permission, user: user, obj: obj });
  return hasPermission;
}

/**
 * Fetch a specific KeyValue from UserContext.
 * If the value is meant to be a boolean, use `checkTruthy` and cast the returned value to boolean.
 *
 * Example:
 * ```ts
 *  const example = useKeyValue(KEY.EXAMPLE, true) as boolean;
 * ```
 */
export function useKeyValue(key: Key, checkTruthy?: boolean): string | boolean | undefined {
  const { keyValues } = useGlobalContext();
  const keyValue = keyValues.get(key);
  if (checkTruthy) {
    return isTruthy(keyValue);
  }
  return keyValue;
}

export function useIsDarkTheme(): boolean {
  const { theme } = useGlobalContext();
  return theme === THEME.DARK;
}

export function useIsLightTheme(): boolean {
  const { theme } = useGlobalContext();
  return theme === THEME.LIGHT;
}

/** Returns if primary mouse button is currently pressed down */
export function useMouseDown(): boolean {
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    function handleMouseDown() {
      setMouseDown(true);
    }

    function handleMouseUp() {
      setMouseDown(false);
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return mouseDown;
}

export function useMousePosition(): { x: number; y: number } {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return position;
}

/** Return type for hook useMouseTrail. */
type UseMouseTrail = {
  isMouseTrail: boolean;
  setIsMouseTrail: SetState<boolean>;
  toggleMouseTrail: () => boolean;
};

/**
 * When used will spawn a trail behind the cursor.
 * Currently only meant to be used in GlobalContextProvider.
 */
export function useMouseTrail(): UseMouseTrail {
  const { user } = useAuthContext();

  const [isMouseTrail, setIsMouseTrail] = useState<boolean>(false);

  const container = document.createElement('div');
  document.body.appendChild(container);

  useEffect(() => {
    if (!user) return;
    setIsMouseTrail(user.user_preference.cursor_trail);
  }, [user]);

  // Spawn trail behind cursor whenever it moves.
  useEffect(() => {
    if (!isMouseTrail) return;

    function handleMouseMove(e: MouseEvent) {
      const dot = createDot(e);
      container.appendChild(dot);

      // We need to clean all the elements the trail produces.
      // If we don't do this, the <body> will be cluttered with thousands of elements.
      // That would likely cause performance issues.
      // This delay must be equal to or longer than the trail animation.
      setTimeout(() => {
        dot.remove();
      }, 2000); // Remove the element after 1 second
    }

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [container, isMouseTrail]);

  /** Simplified theme switching. Returns theme it switched to. */
  function toggleMouseTrail(): boolean {
    const newIsCursorTrail = !isMouseTrail;

    setIsMouseTrail(newIsCursorTrail);
    if (user) {
      putUserPreference(user.user_preference.id, { cursor_trail: newIsCursorTrail });
    }
    return newIsCursorTrail;
  }

  return { isMouseTrail, setIsMouseTrail, toggleMouseTrail };
}

/** Return type for hook useTheme. */
type UseTheme = {
  theme: ThemeValue;
  setTheme: SetState<ThemeValue>;
  switchTheme: () => ThemeValue;
};

/**
 * Grouped functionality for theme.
 * Only meant to be used in GlobalContextProvider.
 */
export function useTheme(): UseTheme {
  const { user } = useAuthContext();

  // Get theme from localStorage.
  const storedTheme = (localStorage.getItem(THEME_KEY) as ThemeValue) || undefined;

  // Determine browser preference.
  const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const detectedTheme = prefersDarkTheme ? THEME.DARK : THEME.LIGHT;
  const initialTheme = storedTheme || detectedTheme;

  const [theme, setTheme] = useState<ThemeValue>(initialTheme);

  // Update body classes when theme changes.
  useEffect(() => {
    updateBodyThemeClass(theme);
  }, [theme]);

  // Update theme when user changes.
  useEffect(() => {
    if (user?.user_preference.theme) {
      setTheme(user.user_preference.theme);
    }
  }, [user]);

  /** Simplified theme switching. Returns theme it switched to. */
  function switchTheme(): ThemeValue {
    const isLightTheme = theme === THEME.LIGHT;
    const themeToSet = isLightTheme ? THEME.DARK : THEME.LIGHT;
    setTheme(themeToSet);
    if (user) {
      putUserPreference(user.user_preference.id, { theme: themeToSet });
    }
    return themeToSet;
  }

  return { theme, setTheme, switchTheme };
}

/**
 * Adds a callback to clicks outside of some element
 * @param callback Function called when clicked outside
 * @param deps Optional additional dependencies for callback function
 * @returns react reference on component you can click outside
 */
export function useClickOutside<T extends Node>(
  callback: () => void,
  event: 'mousedown' | 'mouseup' = 'mousedown',
): MutableRefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    function handleClickOutside(evt: MouseEvent) {
      if (evt.target instanceof Element) {
        if (ref.current && !ref.current.contains(evt.target)) {
          callback();
        }
      }
    }
    document.addEventListener(event, handleClickOutside);
    // Remove listener on cleanup
    return () => {
      document.removeEventListener(event, handleClickOutside);
    };
  }, [ref, event, callback]);
  return ref;
}

export type CustomNavigateProps = {
  isMetaDown?: boolean;
  event?: React.MouseEvent;
  url: string | number;
  linkTarget?: LinkTarget;
  replace?: boolean;
};

export type CustomNavigateFn = (props: CustomNavigateProps, direction?: number) => void;

/**
 * Custom navigation hook to correctly navigate in different environments.
 * This is the function our <Link> component uses.
 */
export function useCustomNavigate(): CustomNavigateFn {
  const navigate = useNavigate();
  const { setIsMobileNavigation } = useGlobalContext();

  function handleClick({ event, isMetaDown, url, replace = false, linkTarget = 'frontend' }: CustomNavigateProps) {
    const finalUrl = linkTarget === 'backend' ? BACKEND_DOMAIN + url : url;
    // Stop default <a> tag onClick handling. We want custom behaviour depending on the target.
    event?.preventDefault();

    // Even though nested <a> tags are illegal, they might occur.
    // To prevent multiple link clicks on overlaying elements, stop propagation upwards.
    event?.stopPropagation();

    // Close mobile menu if originates from there.
    setIsMobileNavigation(false);

    /** Detected desire to open the link in a new tab.
     * True if ctrl or cmd click.
     */
    const isCmdClick = isMetaDown || (event && (event.ctrlKey || event.metaKey));
    // React navigation.
    if (linkTarget === 'frontend' && !isCmdClick) {
      navigate(typeof url === 'number' ? url : finalUrl, { replace });
    }
    // Normal change of href to trigger reload.
    else if (linkTarget === 'backend' && !isCmdClick) window.location.href = finalUrl;
    else if (linkTarget === 'email') window.location.href = finalUrl;
    // Open in new tab.
    else window.open(finalUrl, '_blank');
  }

  return handleClick;
}

/**
 * Track if ctrl or cmd is pressed down.
 */
export function useIsMetaKeyDown(): boolean {
  const [isDown, setIsDown] = useState(false);

  // Toggle the menu when ⌘K is pressed.
  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey) {
        setIsDown(true);
      }
    }
    function up(e: KeyboardEvent) {
      if (e.key === 'Meta' || e.ctrlKey) {
        setIsDown(false);
      }
    }

    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, []);

  return isDown;
}

export function useTitle(title: string, suffix: string = 'Samfundet'): void {
  const initialTitle = document.title;
  useEffect(() => {
    document.title = title ? `${title}${suffix ? ' - ' + suffix : ''}` : suffix;

    return () => {
      document.title = initialTitle;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, suffix]);
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed
      // within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

/* ===================================================
 * CRUD-operation hooks
 */

type FetchFunction<T> = () => Promise<T>;

interface UseReadResult<T> {
  response: T | null;
  loading: boolean;
  error: Error | null;
}

export function useRead<T>(fetchFunction: FetchFunction<T>): UseReadResult<T> {
  const [response, setResponse] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isMounted.current) return;
      setLoading(true);
      try {
        const result = await fetchFunction();
        if (isMounted.current) {
          setResponse(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
          setResponse(null);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, [fetchFunction]);

  return { response, loading, error };
}

/* --== Delete ==-- */

type DeleteFunction<T> = (item: T) => Promise<void>;

interface UseDeleteOptions<T> {
  onDeleteSuccess: (deletedItem: T) => void;
  confirmMessage?: (item: T) => string;
  successMessage?: (item: T) => string;
  errorMessage?: (item: T, error: Error) => string;
}

/**
 * Helper function to get a display name for an object.
 * It tries to find a suitable property to use as a name, falling back to generic labels if needed.
 * @param item - The object to get a display name for
 * @returns A string representation of the item's name, or "object" if it does not have a name or title
 */
function getItemDisplayName<T extends object>(item: T): string {
  // Check for a 'name' property first
  if ('name' in item && typeof item.name === 'string') {
    return item.name;
  }
  // If no 'name', check for a 'title' property
  if ('title' in item && typeof item.title === 'string') {
    return item.title;
  }
  // If no 'name' or 'title', use the 'id' with a prefix
  if ('id' in item) {
    return `${typeof item === 'object' ? 'Object' : 'Item'} ${String(item.id)}`;
  }
  // If all else fails, just return 'object'
  return 'object';
}

/**
 * Custom hook for handling delete operations with confirmation and feedback.
 * @param deleteApiCall - The function to call to perform the delete operation
 * @param options - Configuration options for the delete operation
 * @returns A function that can be called to initiate the delete process
 */
export function useDelete<T extends { id: number | string }>(
  deleteApiCall: DeleteFunction<T>,
  options: UseDeleteOptions<T>,
): (item: T) => Promise<void> {
  const { t } = useTranslation();

  //  Memoized delete handler function
  const handleDelete = useCallback(
    async (item: T): Promise<void> => {
      // Get a display name for the item, using dbT if available, otherwise fall back to getItemDisplayName
      const itemName = dbT(item, 'name') || getItemDisplayName(item);
      // Create a confirmation message, using a custom one if provided, otherwise use a default
      const confirmMsg = options.confirmMessage
        ? options.confirmMessage(item)
        : `${lowerCapitalize(`${t(KEY.form_confirm)} ${t(KEY.common_delete)}`)} ${itemName}`;

      // Show a confirmation dialog
      if (window.confirm(confirmMsg)) {
        try {
          // Attempt to delete the item
          await deleteApiCall(item);
          // If successful, call the onDeleteSuccess callback
          options.onDeleteSuccess(item);
          // Show a success toast, using a custom message if provided, otherwise use a default
          const successMsg = options.successMessage ? options.successMessage(item) : t(KEY.common_delete_successful);
          toast.success(successMsg);
        } catch (error) {
          // Show an error toast, using a custom message if provided, otherwise use a default
          console.error('Error deleting item:', error);
          const errorMsg = options.errorMessage
            ? options.errorMessage(item, error instanceof Error ? error : new Error(String(error)))
            : t(KEY.common_something_went_wrong);
          toast.error(errorMsg);
        }
      }
    },
    [deleteApiCall, options, t], // Dependencies for the useCallback hook
  );

  // Return the delete handler function
  return handleDelete;
}

/* --== Update ==-- */

type UpdateFunction<T> = (id: string | number, data: Partial<T>) => Promise<T>;

interface UseUpdateOptions<T> {
  onSuccess?: (updatedItem: T) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface UseUpdateResult<T> {
  update: (id: string | number, data: Partial<T>) => Promise<T | null>;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook for handling update operations with feedback.
 * @param updateApiCall - The function to call to perform the update operation
 * @param options - Configuration options for the update operation
 * @returns An object with the update function, loading state, and error state
 */
export function useUpdate<T extends { id: string | number }>(
  updateApiCall: UpdateFunction<T>,
  options: UseUpdateOptions<T> = {},
): UseUpdateResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation();

  const update = useCallback(
    async (id: string | number, data: Partial<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const updatedItem = await updateApiCall(id, data);
        setLoading(false);
        toast.success(options.successMessage || t(KEY.common_update_successful));
        options.onSuccess?.(updatedItem);
        return updatedItem;
      } catch (err) {
        setLoading(false);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(new Error(errorMessage));
        toast.error(options.errorMessage || t(KEY.common_something_went_wrong));
        return null;
      }
    },
    [updateApiCall, options, t],
  );

  return { update, loading, error };
}

/* --== Create ==-- */
type CreateFunction<T> = (data: T) => Promise<T>;

interface UseCreateOptions<T> {
  onSuccess?: (createdItem: T) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface UseCreateResult<T> {
  create: (data: T) => Promise<T | null>;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook for handling create operations with feedback.
 * @param createApiCall - The function to call to perform the create operation
 * @param options - Configuration options for the create operation
 * @returns An object with the create function, loading state, and error state
 */
export function useCreate<T>(createApiCall: CreateFunction<T>, options: UseCreateOptions<T> = {}): UseCreateResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation();

  const create = useCallback(
    async (data: T): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const createdItem = await createApiCall(data);
        setLoading(false);
        toast.success(options.successMessage || t(KEY.common_creation_successful));
        options.onSuccess?.(createdItem);
        return createdItem;
      } catch (err) {
        setLoading(false);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(new Error(errorMessage));
        toast.error(options.errorMessage || t(KEY.common_something_went_wrong));
        return null;
      }
    },
    [createApiCall, options, t],
  );

  return { create, loading, error };
}

/**
 * ====================================================
 */
