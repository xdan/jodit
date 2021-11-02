/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	Buttons,
	ButtonsGroup,
	ButtonsGroups,
	IControlType,
	IJodit
} from '../../../types';
import { isArray } from '../../helpers/checker';

export const isButtonGroup = (
	item: ButtonsGroup | string | IControlType
): item is ButtonsGroup => {
	return isArray((<ButtonsGroup>item).buttons);
};

export function flatButtonsSet(
	buttons: ButtonsGroups,
	jodit: IJodit
): Set<string | IControlType> {
	const groups = jodit.getRegisteredButtonGroups();

	return new Set(
		buttons.reduce(
			(acc: Buttons, item: ButtonsGroup | string | IControlType) => {
				if (isButtonGroup(item)) {
					acc = acc.concat([
						...(<ButtonsGroup>item).buttons,
						...(groups[item.group] ?? [])
					]);
				} else {
					acc.push(item);
				}

				return acc;
			},
			[] as Buttons
		)
	);
}
