/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Sets a handler for changing the component's status.
 *
 * ```ts
 * import { component, hook } from 'jodit/src/core/decorators';
 * import { UIElement } from 'jodit/src/ui';
 *
 * @component()
 * class UISomeElement extends UIElement {
 * 	@hook('ready')
 * 	protected onReadyHandler(): void {
 * 		alert('Component ise ready');
 * 	}
 * }
 * ```
 *
 * Component statuses can be viewed in [[STATUSES]]
 *
 * @module decorators/debounce
 */

import type {
	ComponentStatus,
	IDictionary,
	IViewBased,
	IViewComponent
} from '../../types';
import type { Component } from '../component';
import { error, isFunction } from '../helpers';

/**
 * Call on some component status
 */
export function hook(status: ComponentStatus) {
	return <T extends Component & IDictionary>(
		target: IDictionary,
		propertyKey: string
	): void => {
		if (!isFunction(target[propertyKey])) {
			throw error('Handler must be a Function');
		}

		target.hookStatus(status, (component: IViewComponent | IViewBased) => {
			target[propertyKey].call(component);
		});
	};
}
