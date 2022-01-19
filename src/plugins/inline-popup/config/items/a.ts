/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/inline-popup
 */

import type { IControlType, IJodit } from 'jodit/types';
import { attr } from '../../../../core/helpers/utils';

export default [
	{
		name: 'eye',
		tooltip: 'Open link',
		exec: (editor: IJodit, current) => {
			const href = attr(current as HTMLElement, 'href');

			if (current && href) {
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
