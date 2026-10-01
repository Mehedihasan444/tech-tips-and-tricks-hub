/**
 * Express 5 types `req.params` values as `string | string[]`.
 * Route params are single segments in this API, so take the first value
 * when a wildcard/array sneaks in, and throw a 400-style error when missing.
 */
export const getRouteParam = (value: string | string[] | undefined, name = "param"): string => {
  const param = Array.isArray(value) ? value[0] : value;
  if (!param) {
    throw new Error(`${name} is required`);
  }
  return param;
};
