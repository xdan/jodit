/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Allow save value inside persistent storage as set/get to property
 *
 * ```typescript
 * import { component, persistent } from './src/core/decorators';
 *
 * @component
 * class Item extends UIElement {
 * 	@persistent
 * 	options = {
 * 		some: true
 * 	};
 * }
 *
 * const item = new Item(jodit);
 * console.log(item.options); // {some: true}
 *
 * item.options = {
 * 	some: false
 * };
 *
 * const item2 = new Item(jodit); // or reload page
 * console.log(item.options); // {some: false}
 * ```
 *
 * @module decorators/persistent
 */

import type { IComponent, IDictionary, IViewComponent } from '../../types';
import { STATUSES } from '../component';
import { isViewObject } from '../helpers';

export function persistent<T extends IComponent>(
	target: T,
	propertyKey: string
): void {
	target.hookStatus(STATUSES.ready, (component: T) => {
		const jodit = isViewObject(component)
				? component
				: (component as unknown as IViewComponent).jodit,
			storageKey = `${jodit.options.namespace}${component.componentName}_prop_${propertyKey}`,
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
