/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/inline-popup
 */

import type { IControlType, IDictionary, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		popup: IDictionary<
			| Array<IControlType | string>
			| ((
					editor: IJodit,
					target: HTMLElement | undefined,
					close: () => void
			  ) => Array<IControlType | string> | HTMLElement | string)
		>;

		toolbarInlineDisabledButtons: string[];
		toolbarInline: boolean;
		toolbarInlineForSelection: boolean;
		toolbarInlineDisableFor: string | string[];
	}
}

Config.prototype.toolbarInline = true;
Config.prototype.toolbarInlineForSelection = false;
Config.prototype.toolbarInlineDisableFor = [];
Config.prototype.toolbarInlineDisabledButtons = ['source'];

Config.prototype.popup = {
	a: require('./items/a').default,
	img: require('./items/img').default,
	cells: require('./items/cells').default,
	toolbar: require('./items/toolbar').default,
	jodit: require('./items/iframe').default,
	iframe: require('./items/iframe').default,
	'jodit-media': require('./items/iframe').default,
	selection: [
		'bold',
		'underline',
		'italic',
		'ul',
		'ol',
		'\n',
		'outdent',
		'indent',
		'fontsize',
		'brush',
		'cut',
		'\n',
		'paragraph',
		'link',
		'align',
		'dots'
	]
} as IDictionary<Array<IControlType | string>>;
