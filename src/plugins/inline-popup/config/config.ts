/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/inline-popup
 */

import type { IControlType, IDictionary, IJodit } from 'jodit/types';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import a from './items/a';
import cells from './items/cells';
import jodit from './items/iframe';
import img from './items/img';
import toolbar from './items/toolbar';

import * as addcolumn from 'jodit/plugins/inline-popup/icons/addcolumn.svg';
import * as addrow from 'jodit/plugins/inline-popup/icons/addrow.svg';
import * as merge from 'jodit/plugins/inline-popup/icons/merge.svg';
import * as splitg from 'jodit/plugins/inline-popup/icons/splitg.svg';
import * as splitv from 'jodit/plugins/inline-popup/icons/splitv.svg';
import * as th from 'jodit/plugins/inline-popup/icons/th.svg';
import * as thList from 'jodit/plugins/inline-popup/icons/th-list.svg';

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

Icon.set('addcolumn', addcolumn.default)
	.set('addrow', addrow.default)
	.set('merge', merge.default)
	.set('th', th.default)
	.set('splitg', splitg.default)
	.set('splitv', splitv.default)
	.set('th-list', thList.default);

Config.prototype.popup = {
	a,
	img,
	cells,
	toolbar,
	jodit,
	iframe: jodit,
	'jodit-media': jodit,
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
