import { useGlobalContext } from '~/context/GlobalContextProvider';
import type { Key } from '~/types';
import { isTruthy } from '~/utils';

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
