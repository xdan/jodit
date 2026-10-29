/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/link
 */

import type { IControlType, IJodit, IUIForm, IUIOption } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import linkIcon from './icons/link.svg';
import unlinkIcon from './icons/unlink.svg';

import { formTemplate } from 'jodit/plugins/link/template';

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
			 * Link an address when the space, Enter or Tab after it is typed:
			 * one with a scheme (`https://…`), one that starts with `www.` or a
			 * bare domain such as `example.com` or `education.govt.nz`, which
			 * get `https://`, or an email address, which gets `mailto:`.
			 * Punctuation that ends a sentence stays outside the link, and
			 * Backspace or Undo straight after takes the link off. Not inside a
			 * link, `<pre>` or `<code>`. Default: false.
			 */
			processTypedLink: boolean;

			/**
			 * With `processTypedLink`, the endings a bare domain doesn't link
			 * with, as they're more often a file's: `photos.zip`, `README.md`.
			 * In lower case, without the dot. A plain list replaces this one
			 * entry by entry from the start, so use `Jodit.atom` to replace the
			 * whole list. `Jodit.atom([])` links every real ending.
			 * Default: `['zip', 'mov', 'md', 'py', 'sh', 'pub']`.
			 */
			typedLinkFileEndings: string[];

			/**
			 * When opening the link dialog for a new link with an empty URL field,
			 * pre-fill it from the selected text if that text looks like a URL or
			 * an email address (`example.com` → `https://example.com`,
			 * `user@site.com` → `mailto:user@site.com`). Plain text that is not a
			 * URL/email is left untouched. Default: false.
			 */
			deriveUrlFromText: boolean;

			/**
			 * Show `no follow` checkbox in link dialog.
			 */
			noFollowCheckbox: boolean;

			/**
			 * Show `Open in new tab` checkbox in link dialog.
			 */
			openInNewTabCheckbox: boolean;

			/**
			 * Default value for the `Open in new tab` checkbox when inserting a new link.
			 */
			openInNewTabCheckboxDefaultChecked: boolean;

			/**
			 * Show an `aria-label` text input in the link dialog so an
			 * accessible name can be set on the `<a>` (useful when several
			 * links share the same visible text, e.g. "here"). Default: false.
			 */
			ariaLabelInput: boolean;

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

			/**
			 * Prevent navigation to the link if it is readonly. Default: true
			 */
			preventReadOnlyNavigation: boolean;
		};
	}
}

Config.prototype.link = {
	formTemplate,
	followOnDblClick: false,
	processVideoLink: true,
	processPastedLink: true,
	processTypedLink: false,
	typedLinkFileEndings: ['zip', 'mov', 'md', 'py', 'sh', 'pub'],
	deriveUrlFromText: false,
	noFollowCheckbox: true,
	openInNewTabCheckbox: true,
	openInNewTabCheckboxDefaultChecked: false,
	ariaLabelInput: false,
	modeClassName: 'input',
	selectMultipleClassName: true,
	preventReadOnlyNavigation: true,
	selectSizeClassName: 3,
	selectOptionsClassName: [],
	hotkeys: ['ctrl+k', 'cmd+k']
};

Icon.set('link', linkIcon).set('unlink', unlinkIcon);

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

	popup: (editor: IJodit, current, close: () => void) => {
		return editor.e.fire('generateLinkForm.link', current, close);
	},
	tags: ['a'],
	tooltip: 'Insert link'
} as IControlType;
