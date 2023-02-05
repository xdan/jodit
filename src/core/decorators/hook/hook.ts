/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/decorators/hook/README.md]]
 * @packageDocumentation
 * @module decorators/hook
 */

import type {
	ComponentStatus,
	IDictionary,
	IViewBased,
	IViewComponent
} from 'jodit/types';
import type { Component } from 'jodit/core/component';
import { isFunction } from 'jodit/core/helpers/checker';
import { error } from 'jodit/core/helpers/utils/error';

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
			(component as any)[propertyKey].call(component);
		});
	};
}
