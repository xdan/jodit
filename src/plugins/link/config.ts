/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/link
 */

import type { IControlType, IJodit, IUIOption, IUIForm } from 'jodit/types';
import { Config } from 'jodit/config';
import { formTemplate } from './template';
import { Dom } from 'jodit/core/dom/dom';
import { Icon } from 'jodit/core/ui/icon';

declare module 'jodit/config' {
	interface Config {
		link: {
			/**
			 * Template for the link dialog form
			 */
			formTemplate: (editor: IJodit) => string | HTMLElement | IUIForm;
			formClassName?: string;

			/**
			 * Follow link address after dblclick
			 */
			followOnDblClick: boolean;

			/**
			 * Replace inserted youtube/vimeo link to `iframe`
			 */
			processVideoLink: boolean;

			/**
			 * Wrap inserted link
			 */
			processPastedLink: boolean;

			/**
			 * Show `no follow` checkbox in link dialog.
			 */
			noFollowCheckbox: boolean;

			/**
			 * Show `Open in new tab` checkbox in link dialog.
			 */
			openInNewTabCheckbox: boolean;

			/**
			 * Use an input text to ask the classname or a select or not ask
			 */
			modeClassName: 'input' | 'select';

			/**
			 * Allow multiple choises (to use with modeClassName="select")
			 */
			selectMultipleClassName: boolean;

			/**
			 * The size of the select (to use with modeClassName="select")
			 */
			selectSizeClassName?: number;

			/**
			 * The list of the option for the select (to use with modeClassName="select")
			 */
			selectOptionsClassName: IUIOption[];

			hotkeys: string[];
		};
	}
}

Config.prototype.link = {
	formTemplate,
	followOnDblClick: false,
	processVideoLink: true,
	processPastedLink: true,
	noFollowCheckbox: true,
	openInNewTabCheckbox: true,
	modeClassName: 'input',
	selectMultipleClassName: true,
	selectSizeClassName: 3,
	selectOptionsClassName: [],
	hotkeys: ['ctrl+k', 'cmd+k']
};

Icon.set('link', require('./icons/link.svg')).set(
	'unlink',
	require('./icons/unlink.svg')
);

Config.prototype.controls.unlink = {
	exec: (editor: IJodit, current: Node) => {
		const anchor: HTMLAnchorElement | false = Dom.closest(
			current,
			'a',
			editor.editor
		) as HTMLAnchorElement;

		if (anchor) {
			Dom.unwrap(anchor);
		}

		editor.synchronizeValues();
		editor.e.fire('hidePopup');
	},
	tooltip: 'Unlink'
} as IControlType;

Config.prototype.controls.link = {
	isActive: (editor: IJodit): boolean => {
		const current = editor.s.current();
		return Boolean(current && Dom.closest(current, 'a', editor.editor));
	},

	popup: (editor: IJodit, current, self: IControlType, close: () => void) => {
		return editor.e.fire('generateLinkForm.link', current, close);
	},
	tags: ['a'],
	tooltip: 'Insert link'
} as IControlType;
