/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Wrap function in wait wrapper, it will be called after `condition` returns `true`
 *
 * ```typescript
 * import { component, wait } from 'jodit/src/core/decorators';
 * import { UIElement } from 'jodit/src/ui';
 *
 * @component()
 * class UISomeElement extends UIElement {
 * 	@wait(() => typeof jQuery !== 'undefined)
 * 	protected runOnLoadJQuery(html: string): void {
 * 		jQuery(this.container).html(html);
 * 		alert('Run');
 * 	}
 * }
 *
 * const elm = new UISomeElement(jodit);
 * elm.runOnLoadJQuery('<h1>One</h1>'); // Do nothing
 * // jQuery is loaded
 * // alert
 * ```
 *
 * @module decorators/wait
 */

import type { IViewBased, IViewComponent } from '../../types';
import { error, isFunction, isViewObject } from '../helpers';
import { STATUSES } from '../component';

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
