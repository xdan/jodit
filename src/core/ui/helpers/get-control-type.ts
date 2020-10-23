/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	CanUndef,
	Controls,
	IControlType,
	IControlTypeStrong,
	IDictionary
} from '../../../types';
import { isString } from '../../helpers';
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

	controls ||= Config.defaultOptions.controls;

	if (!isString(button)) {
		buttonControl = { name: 'empty', ...button };

		if (controls[buttonControl.name] !== undefined) {
			buttonControl = {
				...controls[buttonControl.name],
				...buttonControl
			} as IControlTypeStrong;
		}
	} else {
		const list = button.split(/\./);

		let store: IDictionary<IControlType> = controls;

		if (list.length > 1) {
			if (controls[list[0]] !== undefined) {
				store = controls[list[0]] as IDictionary<IControlType>;
				button = list[1];
			}
		}

		if (store[button] !== undefined) {
			buttonControl = { name: button, ...store[button] };
		} else {
			buttonControl = {
				name: button,
				command: button,
				tooltip: button
			};
		}
	}

	return buttonControl;
}
