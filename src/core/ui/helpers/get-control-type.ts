/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	CanUndef,
	Controls,
	IControlType,
	IControlTypeStrong,
	IDictionary
} from '../../../types';
import { ConfigFlatten, isString } from '../../helpers';
import { Config } from '../../../config';

/**
 * Get control for button name
 * @param button
 * @param controls
 */
export function getControlType(
	button: IControlType | string,
	controls: CanUndef<Controls>
): IControlTypeStrong {
	let buttonControl: IControlTypeStrong;

	if (!controls) controls = Config.defaultOptions.controls;

	if (!isString(button)) {
		buttonControl = { name: 'empty', ...ConfigFlatten(button) };

		if (controls[buttonControl.name] !== undefined) {
			buttonControl = {
				...ConfigFlatten(controls[buttonControl.name]),
				...ConfigFlatten(buttonControl)
			} as IControlTypeStrong;
		}
	} else {
		buttonControl = findControlType(button, controls) || {
			name: button,
			command: button,
			tooltip: button
		};
	}

	return buttonControl;
}

export function findControlType(
	path: string,
	controls: Controls
): IControlTypeStrong | void {
	// eslint-disable-next-line prefer-const
	let [namespaceOrKey, key] = path.split(/\./) as string[];

	let store: IDictionary<IControlType> = controls;

	if (key != null) {
		if (controls[namespaceOrKey] !== undefined) {
			store = controls[namespaceOrKey] as IDictionary<IControlType>;
		}
	} else {
		key = namespaceOrKey;
	}

	return store[key]
		? {
				name: key,
				...ConfigFlatten(store[key])
		  }
		: undefined;
}
