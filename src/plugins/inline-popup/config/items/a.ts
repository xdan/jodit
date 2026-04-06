/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/inline-popup
 */

import type { IControlType, IJodit } from 'jodit/types';
import { attr } from 'jodit/core/helpers/utils/attr';

const isSafeHref = (href: string): boolean =>
	/^(https?:|mailto:|tel:)/i.test(href.trim()) &&
	!/^(javascript:|data:|vbscript:)/i.test(href.trim());

export default [
	{
		name: 'eye',
		tooltip: 'Open link',
		exec: (editor: IJodit, current): void => {
			const href = attr(current as HTMLElement, 'href');

			if (current && href && isSafeHref(href)) {
				editor.ow.open(href);
			}
		}
	},
	{
		name: 'link',
		tooltip: 'Edit link',
		icon: 'pencil'
	},
	'unlink',
	'brush',
	'file'
] as Array<IControlType | string>;
