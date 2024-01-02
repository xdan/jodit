/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/format-block/README.md]]
 * @packageDocumentation
 * @module plugins/format-block
 */

import type { HTMLTagNames, IJodit } from 'jodit/types';
import { pluginSystem } from 'jodit/core/global';

import './config';

/**
 * Process command - `formatblock`
 */
export function formatBlock(editor: IJodit): void {
	editor.registerButton({
		name: 'paragraph',
		group: 'font'
	});

	editor.registerCommand(
		'formatblock',
		(command: string, second: string, third: string): false | void => {
			editor.s.commitStyle({
				element: third as HTMLTagNames
			});

			editor.synchronizeValues();

			return false;
		}
	);
}

pluginSystem.add('formatBlock', formatBlock);
