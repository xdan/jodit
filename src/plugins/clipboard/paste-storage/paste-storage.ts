/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './paste-storage.less';

import {
	KEY_DOWN,
	KEY_ENTER,
	KEY_UP,
	SPACE_REG_EXP
} from '../../../core/constants';
import { Dialog } from '../../../modules/dialog';
import { Plugin } from '../../../core/plugin';
import { Dom } from '../../../core/dom';
import { attr, toArray } from '../../../core/helpers';

/**
 * Show dialog choose content to paste
 */
export class pasteStorage extends Plugin {
	private currentIndex: number = 0;

	private list: string[] = [];

	private container: HTMLElement | null = null;
	private listBox: HTMLElement | null = null;
	private previewBox: HTMLElement | null = null;

	private dialog: Dialog | null = null;

	private paste = () => {
		this.j.s.focus();
		this.j.s.insertHTML(this.list[this.currentIndex]);

		if (this.currentIndex !== 0) {
			const buffer = this.list[0];

			this.list[0] = this.list[this.currentIndex];
			this.list[this.currentIndex] = buffer;
		}

		this.dialog && this.dialog.close();
		this.j.setEditorValue();

		this.j.e.fire('afterPaste');
	};

	private onKeyDown = (e: KeyboardEvent) => {
		let index: number = this.currentIndex;
		if ([KEY_UP, KEY_DOWN, KEY_ENTER].indexOf(e.key) === -1) {
			return;
		}

		if (e.key === KEY_UP) {
			if (index === 0) {
				index = this.list.length - 1;
			} else {
				index -= 1;
			}
		}
		if (e.key === KEY_DOWN) {
			if (index === this.list.length - 1) {
				index = 0;
			} else {
				index += 1;
			}
		}

		if (e.key === KEY_ENTER) {
			this.paste();
			return;
		}

		if (index !== this.currentIndex) {
			this.selectIndex(index);
		}

		e.stopImmediatePropagation();
		e.preventDefault();
	};

	private selectIndex = (index: number) => {
		if (this.listBox) {
			toArray(
				this.listBox.childNodes as NodeListOf<HTMLAnchorElement>
			).forEach((a, i) => {
				a.classList.remove('jodit_active');
				if (index === i && this.previewBox) {
					a.classList.add('jodit_active');
					this.previewBox.innerHTML = this.list[index];
					a.focus();
				}
			});
		}

		this.currentIndex = index;
	};

	private showDialog = () => {
		if (this.list.length < 2) {
			return;
		}

		this.dialog || this.createDialog();

		if (this.listBox) {
			this.listBox.innerHTML = '';
		}

		if (this.previewBox) {
			this.previewBox.innerHTML = '';
		}

		this.list.forEach((html: string, index: number) => {
			const a: HTMLElement = this.j.c.element('a');
			a.textContent =
				index + 1 + '. ' + html.replace(SPACE_REG_EXP(), '');

			this.j.e.on(a, 'keydown', this.onKeyDown);

			attr(a, 'href', 'javascript:void(0)');
			attr(a, 'data-index', index.toString());
			attr(a, 'tab-index', '-1');

			this.listBox && this.listBox.appendChild(a);
		});

		this.dialog && this.dialog.open();

		this.j.async.setTimeout(() => {
			this.selectIndex(0);
		}, 100);
	};

	private createDialog() {
		this.dialog = new Dialog({
			language: this.j.o.language
		});

		const pasteButton: HTMLAnchorElement = this.j.c.fromHTML(
			'<a href="javascript:void(0)" style="float:right;" class="jodit-button">' +
				'<span>' +
				this.j.i18n('Paste') +
				'</span>' +
				'</a>'
		) as HTMLAnchorElement;

		this.j.e.on(pasteButton, 'click', this.paste);

		const cancelButton: HTMLAnchorElement = this.j.c.fromHTML(
			'<a href="javascript:void(0)" style="float:right; margin-right: 10px;" class="jodit-button">' +
				'<span>' +
				this.j.i18n('Cancel') +
				'</span>' +
				'</a>'
		) as HTMLAnchorElement;

		this.j.e.on(cancelButton, 'click', this.dialog.close);

		this.container = this.j.c.div();
		this.container.classList.add('jodit-paste-storage');
		this.listBox = this.j.c.div();
		this.previewBox = this.j.c.div();

		this.container.appendChild(this.listBox);
		this.container.appendChild(this.previewBox);

		this.dialog.setHeader(this.j.i18n('Choose Content to Paste'));
		this.dialog.setContent(this.container);
		this.dialog.setFooter([pasteButton, cancelButton]);

		this.j.e.on(this.listBox, 'click dblclick', (e: MouseEvent) => {
			const a = e.target as HTMLAnchorElement;
			if (Dom.isTag(a, 'a') && a.hasAttribute('data-index')) {
				this.selectIndex(parseInt(attr(a, '-index') || '0', 10));
			}

			if (e.type === 'dblclick') {
				this.paste();
			}

			return false;
		});
	}

	afterInit(): void {
		this.j.e
			.off('afterCopy.paste-storage')
			.on('pasteStorageList.paste-storage', () => this.list.length)
			.on('afterCopy.paste-storage', (html: string) => {
				if (this.list.indexOf(html) !== -1) {
					this.list.splice(this.list.indexOf(html), 1);
				}

				this.list.unshift(html);
				if (this.list.length > 5) {
					this.list.length = 5;
				}
			});

		this.j.registerCommand('showPasteStorage', {
			exec: this.showDialog,
			hotkeys: ['ctrl+shift+v', 'cmd+shift+v']
		});
	}

	beforeDestruct(): void {
		this.dialog && this.dialog.destruct();

		this.j.e.off('.paste-storage');

		Dom.safeRemove(this.previewBox);
		Dom.safeRemove(this.listBox);
		Dom.safeRemove(this.container);

		this.container = null;
		this.listBox = null;
		this.previewBox = null;
		this.dialog = null;

		this.list = [];
	}
}
