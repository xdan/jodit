/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IViewBased, IViewComponent } from '../../types';
import { error, isFunction, isViewObject } from '../helpers';
import { STATUSES } from '../component';

/**
 * Wrap function in wait wrapper, it will be called after `condition` returns `true`
 * @param condition
 */
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
