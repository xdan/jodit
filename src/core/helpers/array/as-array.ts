/**
 * Always return Array
 *
 * @param a
 * @return {Array}
 */
import { isArray } from '../checker';

export const asArray = <T>(a: T[] | T): T[] => (isArray(a) ? a : [a]);
