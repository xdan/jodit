/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/array
 */

export interface ReconcileResult<T> {
	added: T[];
	removed: T[];
	kept: T[];
	moved: Array<{ item: T; from: number; to: number }>;
}

/**
 * Reconciles two arrays and returns the differences
 * @param oldArray - The original array
 * @param newArray - The new array to compare against
 * @param keyFn - Optional function to generate unique keys for items (for object comparison)
 * @returns Object containing added, removed, kept and moved items
 *
 * @example
 * ```typescript
 * const old = [1, 2, 3, 4];
 * const new = [2, 4, 5, 1];
 * const result = reconcileArrays(old, new);
 * // result.added = [5]
 * // result.removed = [3]
 * // result.kept = [2, 4, 1]
 * // result.moved = [{item: 1, from: 0, to: 3}]
 * ```
 *
 * @example
 * ```typescript
 * const old = [{id: 1, name: 'a'}, {id: 2, name: 'b'}];
 * const new = [{id: 2, name: 'b'}, {id: 3, name: 'c'}];
 * const result = reconcileArrays(old, new, item => item.id);
 * // result.added = [{id: 3, name: 'c'}]
 * // result.removed = [{id: 1, name: 'a'}]
 * ```
 */
export function reconcileArrays<T>(
	oldArray: T[],
	newArray: T[],
	keyFn?: (item: T) => string | number
): ReconcileResult<T> {
	const getKey = keyFn || ((item: T): string | number | T => item);

	const oldMap = new Map<string | number | T, { item: T; index: number }>();
	const newMap = new Map<string | number | T, { item: T; index: number }>();

	oldArray.forEach((item, index) => {
		oldMap.set(getKey(item), { item, index });
	});

	newArray.forEach((item, index) => {
		newMap.set(getKey(item), { item, index });
	});

	const added: T[] = [];
	const removed: T[] = [];
	const kept: T[] = [];
	const moved: Array<{ item: T; from: number; to: number }> = [];

	// Find removed items
	oldMap.forEach((value, key) => {
		if (!newMap.has(key)) {
			removed.push(value.item);
		}
	});

	// Find added items and track kept/moved items
	newMap.forEach((value, key) => {
		const oldItem = oldMap.get(key);
		if (!oldItem) {
			added.push(value.item);
		} else {
			kept.push(value.item);
			if (oldItem.index !== value.index) {
				moved.push({
					item: value.item,
					from: oldItem.index,
					to: value.index
				});
			}
		}
	});

	return {
		added,
		removed,
		kept,
		moved
	};
}

/**
 * Applies reconciliation patches to transform one array into another
 * @param oldArray - The original array to transform
 * @param newArray - The target array structure
 * @param keyFn - Optional function to generate unique keys for items
 * @returns New array matching the structure of newArray
 */
export function applyArrayReconciliation<T>(
	oldArray: T[],
	newArray: T[],
	keyFn?: (item: T) => string | number
): T[] {
	const result = reconcileArrays(oldArray, newArray, keyFn);
	const output: T[] = [];

	// Build the new array based on newArray order
	newArray.forEach(item => {
		const key = keyFn ? keyFn(item) : item;
		const isNew = result.added.some(
			addedItem => (keyFn ? keyFn(addedItem) : addedItem) === key
		);

		if (isNew) {
			output.push(item);
		} else {
			// Use the old item reference if it exists
			const oldItem = oldArray.find(
				oldItem => (keyFn ? keyFn(oldItem) : oldItem) === key
			);
			if (oldItem !== undefined) {
				output.push(oldItem);
			}
		}
	});

	return output;
}
