import { compile, type Key, ParamData, parse } from 'path-to-regexp';

// Credit: https://github.com/kennedykori/named-urls/blob/master/src/index.ts

// ===================================================
// TYPES
// ===================================================
export type ExtraFields = {
  base: string;
  self: string;
  star: string;
};

export type Include = <dR extends Routes>(path: string, routes: dR) => dR & ExtraFields;

export type Routes = {
  [path: string]: string | Routes;
};

export type Params = Record<string, string | number | undefined>;

export interface ReverseParams {
  pattern: string;
  urlParams?: Params;
  queryParams?: Params;
}

export type Reverse = (params: ReverseParams) => string;

export type ReverseForce = Reverse;

// ===================================================
// IMPLEMENTATION
// ===================================================

/**
 * Nested routing with scope and included patterns.
 *
 * CHANGED:
 * Added `base`, `self` and `star` to all entries.
 * `base`: Raw `base`, not affected by nesting.
 * `self`: Full path to `base`.
 * `star`: Raw base as route representation to catch all patterns. `base` suffixed with `/*`.
 * Removed toString().
 */
export const include: Include = (base, routes) => {
  const mappedRoutes: Routes = {
    base: routes.base || base,
    self: base,
    star: routes.star || [base, '*'].join('/').replace('//', '/'),
  };

  /** Reserved attributes from nested prefixing of base. */
  const preventPrefixFields = ['base', 'star'];

  const filteredRoutes = Object.keys(routes).filter((route) => !preventPrefixFields.includes(route));

  for (const route of filteredRoutes) {
    const url = routes[route];

    if (typeof url === 'object') {
      // nested include - prefix all sub-routes with base
      mappedRoutes[route] = include(base, url);
    } else if (typeof url === 'string') {
      // route - prefix with base and replace duplicate //
      mappedRoutes[route] = url.indexOf('/') === 0 ? url : [base, url].join('/').replace('//', '/');
    } else {
      // don't allow invalid routes object
      throw new TypeError(
        `"${route}" is not valid. A routes object can only contain a string, an object or the "toString" method as values.`,
      );
    }
  }

  return mappedRoutes as typeof routes & ExtraFields;
};

/**
 * Helper to reverse patterns and inject params.
 */
function compileWithParams<P extends ParamData>(pattern: string, params: P) {
  const reversed = compile<P>(pattern);

  return reversed(params);
}

/**
 * Reverse patterns with params.
 * `urlParams` are injected into `pattern`.
 * `queryParams` will be added as key-values after `?`.
 *
 * Example:
 * ```ts
 *
 * reverse({
 *     pattern: 'some/:param/path/',
 *     urlParams: {param: 'relative'},
 *     queryParams: {q: 'test', s: 1, t: undefined},
 * })
 * >>> 'some/relative/path/?q=test&s=1'
 * ```
 */
export const reverse: Reverse = ({ pattern, urlParams = {}, queryParams = {} }) => {
  try {
    // tostring all number values in urlParams
    const urlParamsStringified = Object.keys(urlParams).reduce<Record<string, string>>((newUrlParams, urlParamKey) => {
      const value = urlParams[urlParamKey];
      return Object.assign(newUrlParams, { [urlParamKey]: value + '' }); // Converts number to string.
    }, {});

    // Compile pattern with params, e.g.: '/some/:param/' => '/some/replaced/'
    const compiledRoute = compileWithParams(pattern, urlParamsStringified);

    // Strip undefined values and convert to string.
    // Needed because URLSearchParams only accepts Record<string,string>.
    const queryParamsExisting = Object.keys(queryParams).reduce<Record<string, string>>(
      (newQueryParams, queryParamKey) => {
        const value = queryParams[queryParamKey];
        if (value === undefined) return newQueryParams;
        return Object.assign(newQueryParams, { [queryParamKey]: `${value}` }); // Converts number to string.
      },
      {},
    );

    // Convert objects to searchParams, e.g.: {q: 'test', id: '2'} => 'q=test&id=2'
    const queryParamsParsed = new URLSearchParams(queryParamsExisting).toString();

    return queryParamsParsed === '' ? compiledRoute : `${compiledRoute}?${queryParamsParsed}`;
  } catch (err) {
    if (Object.values(urlParams).includes(undefined)) {
      console.log('urlParams', urlParams);
      throw new Error('Reverse parameter cannot be undefined. See parameters logged above.');
    }
    if (pattern.includes(':')) {
      /*
      Urls usually don't contain colon.
      For the time being, we assume that if a pattern still contains ':',
      it means that at least one param was not replaced, e.g. '/some/:param/'.
      We want to know this asap during runtime, therefore throw error.
      */

      // Find expected params.
      const tokens = parse(pattern)
        .tokens.filter((token) => typeof token === 'object')
        .map((token) => {
          return (token as Key).name; // We have filtered on objects, we know this is a Key.
        });

      // Parse expected and received params to strings.
      const tokens_string = JSON.stringify(tokens);
      const params_string = JSON.stringify(Object.keys(urlParams));

      throw new Error(`\n\nCould not reverse "${pattern}".\nExpected: ${tokens_string}.\nGot: ${params_string}.\n`);
    }
    return pattern;
  }
};

export const reverseForce: ReverseForce = ({ pattern, urlParams = {} }) => {
  try {
    // tostring all number values in urlParams
    const urlParamsStringified = Object.keys(urlParams).reduce<Record<string, string>>((newUrlParams, urlParamKey) => {
      const value = urlParams[urlParamKey];
      return Object.assign(newUrlParams, { [urlParamKey]: value + '' }); // Converts number to string.
    }, {});
    return compileWithParams(pattern, urlParamsStringified);
  } catch (err) {
    const tokens = parse(pattern).tokens;

    return tokens.filter((token: unknown) => typeof token === 'string').join('');
  }
};
