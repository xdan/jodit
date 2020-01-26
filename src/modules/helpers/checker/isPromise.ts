/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export function isPromise(val: any | Promise<any>): val is Promise<any> {
	return val && typeof (<Promise<any>>val).then === 'function';
}
