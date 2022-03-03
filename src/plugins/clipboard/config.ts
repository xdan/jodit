/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clipboard
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';

Config.prototype.controls.cut = {
	command: 'cut',
	isDisabled: (editor: IJodit) => editor.s.isCollapsed(),
	tooltip: 'Cut selection'
} as IControlType;

Config.prototype.controls.copy = {
	command: 'copy',
	isDisabled: (editor: IJodit) => editor.s.isCollapsed(),
	tooltip: 'Copy selection'
} as IControlType;

Config.prototype.controls.selectall = {
	icon: 'select-all',
	command: 'selectall',
	tooltip: 'Select all'
} as IControlType;
