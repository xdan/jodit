/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/decorators/persistent/README.md]]
 * @packageDocumentation
 * @module decorators/persistent
 */

import type { IComponent, IDictionary, IViewBased } from 'jodit/types';
import { STATUSES } from 'jodit/core/component';
import { isViewObject } from 'jodit/core/helpers/checker/is-view-object';

export function persistent<T extends IComponent>(
	target: T,
	propertyKey: string
): void {
	target.hookStatus(STATUSES.ready, (component: T) => {
		const jodit = isViewObject(component)
				? component
				: (component as unknown as { jodit: IViewBased }).jodit,
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
