/**
 * Always return Array
 *
 * @param a
 * @return {Array}
 */
export const asArray = <T>(a: T[] | T): T[] => (Array.isArray(a) ? a : [a]);