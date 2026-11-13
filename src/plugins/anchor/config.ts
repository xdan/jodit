/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/anchor
 */

import type { IControlType, IJodit, IUIForm } from 'jodit/types';
import { Config } from 'jodit/config';

// The anchor's popup goes in its list
import 'jodit/plugins/inline-popup/config/config';

Config.prototype.controls.anchor = {
	popup: (editor: IJodit, current, close: () => void) =>
		editor.e.fire('generateAnchorForm.anchor', null, close),
	tooltip: 'Insert anchor'
} as IControlType;

Config.prototype.popup.anchor = (
	editor: IJodit,
	target: HTMLElement | undefined,
	close: () => void
): IUIForm => editor.e.fire('generateAnchorForm.anchor', target, close);
