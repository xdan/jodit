/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from '../../../types';
import './config';

export function video(editor: IJodit) {
	editor.registerButton({
		name: 'video',
		group: 'media'
	});
}
