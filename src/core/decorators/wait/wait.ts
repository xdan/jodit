/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/decorators/wait/README.md]]
 * @packageDocumentation
 * @module decorators/wait
 */

import type { IViewBased, IViewComponent } from 'jodit/types';
import { error, isFunction, isViewObject } from 'jodit/core/helpers';
import { STATUSES } from 'jodit/core/component';

export function wait<T extends IViewBased>(
	condition: (ctx: T) => boolean
): Function;
export function wait<T extends IViewComponent>(
	condition: (ctx: T) => boolean
): Function;
export function wait<T extends IViewComponent | IViewBased>(
	condition: (ctx: T) => boolean
): Function {
	return (target: T, propertyKey: string) => {
		if (!isFunction((target as any)[propertyKey])) {
			throw error('Handler must be a Function');
		}

		target.hookStatus(
			STATUSES.ready,
			(component: IViewBased | IViewComponent) => {
				const async = isViewObject(component)
					? component.async
					: component.j.async;

				const realMethod = (component as any)[propertyKey];

				let timeout: number = 0;

				(component as any)[propertyKey] = function callProxy(
					...args: any[]
				): void {
					async.clearTimeout(timeout);

					if (condition(component as any)) {
						realMethod.apply(component, args);
					} else {
						timeout = async.setTimeout(
							() => callProxy(...args),
							10
						);
					}
				};
			}
		);
	};
}
