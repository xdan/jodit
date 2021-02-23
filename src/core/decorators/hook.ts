/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
 * @param timeout
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
