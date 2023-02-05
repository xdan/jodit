/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/decorators/debounce/README.md]]
 * @packageDocumentation
 * @module decorators/debounce
 */

import type {
	IDictionary,
	IViewComponent,
	IAsyncParams,
	DecoratorHandler
} from 'jodit/types';
import {
	isFunction,
	isNumber,
	isPlainObject
} from 'jodit/core/helpers/checker';
import { Component, STATUSES } from 'jodit/core/component';
import { error } from 'jodit/core/helpers/utils/error';
import { assert } from 'jodit/core/helpers/utils/assert';

export function debounce<V extends IViewComponent = IViewComponent>(
	timeout?: number | ((ctx: V) => number | IAsyncParams) | IAsyncParams,
	firstCallImmediately: boolean = false,
	method: 'debounce' | 'throttle' = 'debounce'
): DecoratorHandler {
	return <T extends Component & IDictionary>(
		target: IDictionary,
		propertyKey: string
	): PropertyDescriptor => {
		const fn = target[propertyKey];
		if (!isFunction(fn)) {
			throw error('Handler must be a Function');
		}

		target.hookStatus(STATUSES.ready, (component: V) => {
			const { async } = component;

			assert(
				async != null,
				`Component ${
					component.componentName || component.constructor.name
				} should have "async:IAsync" field`
			);

			const realTimeout = isFunction(timeout)
				? timeout(component)
				: timeout;

			Object.defineProperty(component, propertyKey, {
				configurable: true,
				value: async[method](
					(component as any)[propertyKey].bind(component),
					isNumber(realTimeout) || isPlainObject(realTimeout)
						? realTimeout
						: component.defaultTimeout,
					firstCallImmediately
				)
			});
		});

		return {
			configurable: true,
			get(): typeof fn {
				return fn.bind(this);
			}
		};
	};
}

/**
 * Wrap function in throttle wrapper
 */
export function throttle<V extends IViewComponent = IViewComponent>(
	timeout?: number | ((ctx: V) => number | IAsyncParams) | IAsyncParams,
	firstCallImmediately: boolean = false
): DecoratorHandler {
	return debounce<V>(timeout, firstCallImmediately, 'throttle');
}
