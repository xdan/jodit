/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clipboard
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import copyIcon from './icons/copy.svg';
import cutIcon from './icons/cut.svg';
import pasteIcon from './icons/paste.svg';
import selectAllIcon from './icons/select-all.svg';

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

Icon.set('copy', copyIcon)
	.set('cut', cutIcon)
	.set('paste', pasteIcon)
	.set('select-all', selectAllIcon);
