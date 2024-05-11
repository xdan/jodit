/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/toolbar/button
 */

import type { IViewBased } from 'jodit/types';
import { component } from 'jodit/core/decorators';
import { isPlainObject } from 'jodit/core/helpers/checker/is-plain-object';
import { isString } from 'jodit/core/helpers/checker/is-string';

import { ToolbarButton } from '../button';

import './select.less';

@component
export class ToolbarSelect<
	T extends IViewBased = IViewBased
> extends ToolbarButton<T> {
	override className(): string {
		return 'ToolbarSelect';
	}

	override update(): void {
		super.update();

		this.state.icon.name = '';

		const { list, data } = this.control;

		if (list) {
			let key: string | number | boolean | undefined =
				this.state.value ||
				(data && isString(data.currentValue)
					? data.currentValue
					: undefined);

			if (!key) {
				const keys = Object.keys(list);
				key = keys[0];
			}

			const text = (
				isPlainObject(list) ? list[key.toString()] || key : key
			).toString();

			this.state.text =
				this.control.textTemplate?.(this.jodit, text) ?? text;
		}
	}
}
