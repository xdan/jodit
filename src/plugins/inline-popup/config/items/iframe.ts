/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/inline-popup
 */
import type { IJodit, Nullable } from 'jodit/types';

import { align } from './img';

export default [
	{
		name: 'replace',
		icon: 'video',
		tooltip: 'Replace',
		popup: (
			editor: IJodit,
			target: Nullable<Node>,
			close: () => void
		): HTMLElement | void =>
			target
				? editor.e.fire('generateReplaceVideoTabs', target, close)
				: undefined
	},
	{
		name: 'bin',
		tooltip: 'Delete',
		exec: (editor: IJodit, image: HTMLImageElement): void => {
			image && editor.s.removeNode(image);
		}
	},
	{
		name: 'pencil',
		tooltip: 'Edit',
		exec: (editor: IJodit, target: HTMLElement): void => {
			target && editor.e.fire('openVideoProperties', target);
		}
	},
	align
];
