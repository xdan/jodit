/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

/**
 * Keys that must never be written from a (potentially untrusted) source —
 * assigning them while walking/merging an object can reach and mutate
 * `Object.prototype` (prototype pollution, CWE-1321).
 */
export const UNSAFE_PROTO_KEYS = ['__proto__', 'constructor', 'prototype'];

/**
 * Check whether a key can be used to pollute the prototype chain.
 */
export function isUnsafeProtoKey(key: string): boolean {
	return UNSAFE_PROTO_KEYS.indexOf(key) !== -1;
}
