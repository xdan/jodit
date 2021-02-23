/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, IPlugin, IControlType } from '../../src/types';

Jodit.defaultOptions.controls.example = {
	iconURL: '{basePath}plugins/example/icon.svg',
	tooltip: 'Example',
	popup: (): string => {
		return '<div class="jodit_example">Example plugin</div>';
	}
} as IControlType;

Jodit.defaultOptions.controls.example2 = {
	iconURL: '{basePath}plugins/example/icon.svg',
	tooltip: 'Example2',
	exec: (editor: IJodit) => {
		editor.s.insertHTML('Hello world');
	}
} as IControlType;

/**
 * Support example
 * @example
 * var jodit = new Jodit('#editor', {
 *   buttons: Jodit.defaultOptions.buttons.concat(['example']),
 *   extraPlugins: ['example']
 * });
 */
class example implements IPlugin<IJodit> {
	hasStyle = true;
	jodit!: IJodit;

	init(jodit: IJodit): void {
		alert('Example plugin');
	}

	destruct() {}
}

Jodit.plugins.add('example', example);

/**
 * Plugin use object
 */
Jodit.plugins.add('example2', {
	init() {
		alert('Example2 plugin');
	},
	destruct() {}
} as any);
