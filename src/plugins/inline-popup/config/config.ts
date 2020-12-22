/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IControlType, IDictionary, IJodit } from '../../../types';
import { Config } from '../../../config';

declare module '../../../config' {
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
	jodit: [
		{
			name: 'bin',
			tooltip: 'Delete',
			exec: (editor: IJodit, image) => {
				image && editor.s.removeNode(image);
			}
		}
	],
	'jodit-media': [
		{
			name: 'bin',
			tooltip: 'Delete',
			exec: (editor: IJodit, image) => {
				image && editor.s.removeNode(image);
			}
		}
	],
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
