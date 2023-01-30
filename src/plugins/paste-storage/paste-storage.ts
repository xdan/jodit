/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/paste-storage/README.md]]
 * @packageDocumentation
 * @module plugins/paste-storage
 */

import './paste-storage.less';

import type { IDialog } from 'jodit/types';
import {
	KEY_DOWN,
	KEY_ENTER,
	KEY_UP,
	SPACE_REG_EXP
} from 'jodit/core/constants';
import { Plugin } from 'jodit/core/plugin/plugin';
import { Dom } from 'jodit/core/dom/dom';
import { attr, toArray } from 'jodit/core/helpers';
import { Button } from 'jodit/core/ui/button/button/button';
import { pluginSystem } from 'jodit/core/global';
import { autobind } from 'jodit/core/decorators';

/**
 * Show dialog choose content to paste
 */
export class pasteStorage extends Plugin {
	private __currentIndex: number = 0;

	private __list: string[] = [];

	private __container: HTMLElement | null = null;
	private __listBox: HTMLElement | null = null;
	private __previewBox: HTMLElement | null = null;

	private __dialog: IDialog | null = null;

	@autobind
	private __paste(): void {
		this.j.s.focus();
		this.j.s.insertHTML(this.__list[this.__currentIndex]);

		if (this.__currentIndex !== 0) {
			const buffer = this.__list[0];

			this.__list[0] = this.__list[this.__currentIndex];
			this.__list[this.__currentIndex] = buffer;
		}

		this.__dialog && this.__dialog.close();
		this.j.synchronizeValues();

		this.j.e.fire('afterPaste');
	}

	@autobind
	private __onKeyDown(e: KeyboardEvent): void {
		let index: number = this.__currentIndex;
		if ([KEY_UP, KEY_DOWN, KEY_ENTER].indexOf(e.key) === -1) {
			return;
		}

		if (e.key === KEY_UP) {
			if (index === 0) {
				index = this.__list.length - 1;
			} else {
				index -= 1;
			}
		}
		if (e.key === KEY_DOWN) {
			if (index === this.__list.length - 1) {
				index = 0;
			} else {
				index += 1;
			}
		}

		if (e.key === KEY_ENTER) {
			this.__paste();
			return;
		}

		if (index !== this.__currentIndex) {
			this.__selectIndex(index);
		}

		e.stopImmediatePropagation();
		e.preventDefault();
	}

	@autobind
	private __selectIndex(index: number): void {
		if (this.__listBox) {
			toArray(
				this.__listBox.childNodes as NodeListOf<HTMLAnchorElement>
			).forEach((a, i) => {
				a.classList.remove('jodit_active');
				if (index === i && this.__previewBox) {
					a.classList.add('jodit_active');
					this.__previewBox.innerHTML = this.__list[index];
					a.focus();
				}
			});
		}

		this.__currentIndex = index;
	}

	@autobind
	private __showDialog(): void {
		if (this.__list.length < 2) {
			return;
		}

		this.__dialog || this.__createDialog();

		if (this.__listBox) {
			this.__listBox.innerHTML = '';
		}

		if (this.__previewBox) {
			this.__previewBox.innerHTML = '';
		}

		this.__list.forEach((html: string, index: number) => {
			const a: HTMLElement = this.j.c.element('a');
			a.textContent =
				index + 1 + '. ' + html.replace(SPACE_REG_EXP(), '');

			this.j.e.on(a, 'keydown', this.__onKeyDown);

			attr(a, 'href', '#');
			attr(a, 'data-index', index.toString());
			attr(a, 'tab-index', '-1');

			this.__listBox && this.__listBox.appendChild(a);
		});

		this.__dialog && this.__dialog.open();

		this.j.async.setTimeout(() => {
			this.__selectIndex(0);
		}, 100);
	}

	private __createDialog(): void {
		this.__dialog = this.j.dlg();

		const pasteButton = Button(this.j, 'paste', 'Paste', 'primary');

		pasteButton.onAction(this.__paste);

		const cancelButton = Button(this.j, '', 'Cancel');

		cancelButton.onAction(this.__dialog.close);

		this.__container = this.j.c.div();
		this.__container.classList.add('jodit-paste-storage');
		this.__listBox = this.j.c.div();
		this.__previewBox = this.j.c.div();

		this.__container.appendChild(this.__listBox);
		this.__container.appendChild(this.__previewBox);

		this.__dialog.setHeader(this.j.i18n('Choose Content to Paste'));
		this.__dialog.setContent(this.__container);
		this.__dialog.setFooter([pasteButton, cancelButton]);

		this.j.e.on(this.__listBox, 'click dblclick', (e: MouseEvent) => {
			const a = e.target as HTMLAnchorElement;
			if (Dom.isTag(a, 'a') && a.hasAttribute('data-index')) {
				this.__selectIndex(parseInt(attr(a, '-index') || '0', 10));
			}

			if (e.type === 'dblclick') {
				this.__paste();
			}

			return false;
		});
	}

	afterInit(): void {
		this.j.e
			.off('afterCopy.paste-storage')
			.on('pasteStorageList.paste-storage', () => this.__list.length)
			.on('afterCopy.paste-storage', (html: string) => {
				if (this.__list.indexOf(html) !== -1) {
					this.__list.splice(this.__list.indexOf(html), 1);
				}

				this.__list.unshift(html);
				if (this.__list.length > 5) {
					this.__list.length = 5;
				}
			});

		this.j.registerCommand('showPasteStorage', {
			exec: this.__showDialog,
			hotkeys: ['ctrl+shift+v', 'cmd+shift+v']
		});
	}

	beforeDestruct(): void {
		this.__dialog && this.__dialog.destruct();

		this.j.e.off('.paste-storage');

		Dom.safeRemove(this.__previewBox);
		Dom.safeRemove(this.__listBox);
		Dom.safeRemove(this.__container);

		this.__container = null;
		this.__listBox = null;
		this.__previewBox = null;
		this.__dialog = null;

		this.__list = [];
	}
}

pluginSystem.add('pasteStorage', pasteStorage);
