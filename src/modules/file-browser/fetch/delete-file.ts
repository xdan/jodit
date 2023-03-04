/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/file-browser
 */

import type { IFileBrowser } from 'jodit/types';

/**
 * Removes a file from the server
 * @private
 */
export function deleteFile(
	fb: IFileBrowser,
	name: string,
	source: string
): Promise<void> {
	return fb.dataProvider
		.fileRemove(fb.state.currentPath, name, source)
		.then(message => {
			fb.status(message || fb.i18n('File "%s" was deleted', name), true);
		})
		.catch(fb.status);
}
