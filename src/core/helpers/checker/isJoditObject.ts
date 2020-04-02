/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit } from '../../../types';
import { IToolbarButton } from '../../../types';

/**
 * Check if element is instance of Jodit
 */
export const isJoditObject = (jodit: unknown): jodit is IJodit => {
	if (
		jodit &&
		jodit instanceof Object &&
		typeof jodit.constructor === 'function' &&
		(jodit instanceof Jodit || (jodit as IJodit).isJodit)
	) {
		return true;
	}

	return false;
};

/**
 * Check if element is instance of Jodit
 */
export const isToolbarButtonObject = (button: unknown): button is IToolbarButton => {
	if (
		button &&
		button instanceof Object &&
		typeof button.constructor === 'function' &&
		(button instanceof ToolbarButton || (button as IToolbarButton).isToolbarButton)
	) {
		return true;
	}

	return false;
};

import { Jodit } from '../../../jodit';
import { ToolbarButton } from '../../../modules/toolbar/button/button';
