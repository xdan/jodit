/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/decorators/idle/README.md]]
 * @packageDocumentation
 * @module decorators/idle
 */

import type { DecoratorHandler, IComponent, IDictionary } from 'jodit/types';
import { Component, STATUSES } from 'jodit/core/component';
import { isFunction } from 'jodit/core/helpers/checker/is-function';
import { error } from 'jodit/core/helpers/utils/error';

export function idle<V extends IComponent = IComponent>(): DecoratorHandler {
	return <T extends Component & IDictionary>(
		target: IDictionary,
		propertyKey: string
	): void => {
		if (!isFunction(target[propertyKey])) {
			throw error('Handler must be a Function');
		}

		target.hookStatus(STATUSES.ready, (component: V) => {
			const { async } = component;

			const originalMethod = (component as any)[propertyKey];

			(component as any)[propertyKey] = (...args: unknown[]): number =>
				async.requestIdleCallback(
					originalMethod.bind(component, ...args)
				);
		});
	};
}
