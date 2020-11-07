/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Component, STATUSES } from '../component';
import { IDictionary } from '../../types';

export function persistent(target: Component, propertyKey: string): void {
	target.hookStatus(STATUSES.ready, (component: IDictionary) => {
		component[propertyKey] = new Proxy(component[propertyKey], {
			get(target, prop) {
				return '1'
			},
			set() {
				return '1'
			}
		});
	});
}
