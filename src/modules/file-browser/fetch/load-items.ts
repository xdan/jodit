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
 * Loads a list of files and adds them to the state
 * @private
 */
export function loadItems(fb: IFileBrowser): Promise<any> {
	fb.files.setMod('active', true);
	fb.files.setMod('loading', true);

	return fb.dataProvider
		.items(fb.state.currentPath, fb.state.currentSource, {
			sortBy: fb.state.sortBy,
			onlyImages: fb.state.onlyImages,
			filterWord: fb.state.filterWord
		})
		.then(resp => {
			if (resp) {
				fb.state.elements = resp;
				fb.state.activeElements = [];
			}
		})
		.catch(fb.status)
		.finally(() => fb.files.setMod('loading', false));
}
