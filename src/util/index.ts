/**
 * @module Util
 */


/**
 * Returns a copy of an object, setting or overriding the property with the provided value
 */
export const assoc = (key: string, value: any, obj: Object): Object => ({ ...obj, [key]: value });


/**
 * Returns a copy of an object, setting or overriding the property at the specified path
 * with the provided value.  The path should be provided as a period-delimited string.
 */
export const assocPath = (path: string, value: any, obj: Object): Object => {
  const keys: string[] = path.split('.');
  const key = keys[0];
  if (!keys.length) {
    return obj;
  } else if (keys.length === 1) {
    return assoc(key, value, obj);
  } else {
    const valForKey = get(key, obj);
    const base: Object = (!!valForKey && typeof valForKey === 'object') ? valForKey : { ...obj, [key]: {} };
    const update = assoc(key, assocPath(keys.slice(1).join('.'), value, get(key, base)), obj);
    return { ...obj, ...update };
  }
};

/**
 * Returns a (nested) property from the provided object or undefined
 */
export const get = <T>(props: string, obj: any): T => {
  let result = Object.assign({}, obj);
  const properties = typeof props === 'string' ? props.split('.') : props;
  properties.some((p) => {
    result = result[p];
    return (result === undefined);
  });
  return result;
};

/**
 * Returns a (nested) property from the provided object or the default
 * value if undefined
 */
export const getOr = <T>(defaultValue: any, props: string, obj: any): T => get(props, obj) || defaultValue;

/**
 * Returns a subset of the provided object with the specified properties. Keys whose corresponding
 * values are undefined are not included.
 */
export const pick =
  <T extends { [key: string]: any }, K extends keyof T>(
    props: K[],
    obj: T,
    all: boolean = false): Partial<T> => {
    const update = (acc: object, prop: string): Partial<T> =>
      obj[prop] !== undefined || all ? { ...acc, [prop]: obj[prop] } : acc;
    return props.reduce(update, {});
  };

/**
 * Returns a subset of the provided object with the specified properties. Keys whose corresponding
 * values are undefined are included.
 */
export const pickAll = <T extends { [key: string]: any }, K extends keyof T>(props: K[], obj: T): Partial<T> =>
  pick(props, obj, true);


/**
 * Returns the last element from an array
 */
export const last = <T>(list: T[]): (T | undefined) => list[list.length - 1];

/**
 * Returns the nth element of an array. If a negative value is passed, the nth element from the end
 * of the array will be returned.
 */
export const nth = <T>(n: number, list: T[]): (T | undefined) => {
  return n < 0 ? list[list.length + n] : list[n];
};

/**
 * Returns the first element from a list, or undefined if it doesn't exist
 */
export const head = <T>(list: T[]): (T | undefined) => nth(0, list);

/**
 * Returns a string with an uppercase first character
 */
export const properCase = (s: string) => !!s.length ? `${s[0].toUpperCase()}${s.slice(1)}` : '';

