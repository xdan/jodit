/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	ComponentStatus,
	IDictionary,
	IViewBased,
	IViewComponent
} from '../../types';
import { error, isFunction } from '../helpers';
import { Component } from '../component';

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
