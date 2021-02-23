/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	Buttons,
	ButtonsGroup,
	ButtonsGroups,
	IControlType
} from '../../../types';
import { isArray } from '../../helpers/checker';

export const isButtonGroup = (
	item: ButtonsGroup | string | IControlType
): item is ButtonsGroup => {
	return isArray((<ButtonsGroup>item).buttons);
};

export const flatButtonsSet = (
	buttons: ButtonsGroups
): Set<string | IControlType> =>
	new Set(
		buttons.reduce(
			(acc: Buttons, item: ButtonsGroup | string | IControlType) => {
				if (isButtonGroup(item)) {
					acc.push(...(<ButtonsGroup>item).buttons);
				} else {
					acc.push(item);
				}

				return acc;
			},
			[] as Buttons
		)
	);
