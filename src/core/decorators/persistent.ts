/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { STATUSES } from '../component';
import { IDictionary, IJodit, IViewComponent } from '../../types';

/**
 * Allow save value inside persistent storage as set/get to property
 *
 * @param target
 * @param propertyKey
 */
export function persistent(target: IViewComponent, propertyKey: string): void {
	target.hookStatus(STATUSES.ready, (component: IViewComponent) => {
		const jodit = component.jodit as IJodit,
			storageKey = `${component.componentName}_prop_${propertyKey}`,
			initialValue = (component as IDictionary)[propertyKey];

		Object.defineProperty(component, propertyKey, {
			get() {
				return jodit.storage.get(storageKey) ?? initialValue;
			},
			set(value): void {
				jodit.storage.set(storageKey, value);
			}
		});
	});
}
