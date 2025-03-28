/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui
 */

import type {
	Buttons,
	Controls,
	IControlTypeStrong,
	IDictionary
} from 'jodit/types';
import { isArray } from 'jodit/core/helpers/checker/is-array';
import { ConfigProto, keys } from 'jodit/core/helpers/utils';
import { Config } from 'jodit/config';

import { getControlType } from './get-control-type';

/**
 * @private
 */
export function getStrongControlTypes(
	items: Buttons | IDictionary<string>,
	controls?: Controls
): IControlTypeStrong[] {
	const elements = isArray(items)
		? items
		: keys(items, false).map(key => {
				const value = items[key] || {};
				return ConfigProto({ name: key }, value) as IControlTypeStrong;
			});

	return elements.map(item =>
		getControlType(item, controls || Config.defaultOptions.controls)
	);
}
