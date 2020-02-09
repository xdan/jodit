/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { KEY_DOWN, KEY_ENTER, KEY_UP, SPACE_REG_EXP } from '../../constants';
import { Dialog } from '../../modules/dialog/dialog';
import { Plugin } from '../../modules/Plugin';
import { Dom } from '../../modules/Dom';

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
		this.jodit.selection.focus();
		this.jodit.selection.insertHTML(this.list[this.currentIndex]);

		if (this.currentIndex !== 0) {
			const buffer = this.list[0];

			this.list[0] = this.list[this.currentIndex];
			this.list[this.currentIndex] = buffer;
		}

		this.dialog && this.dialog.close();
		this.jodit.setEditorValue();
	};

	private onKeyDown = (e: KeyboardEvent) => {
		let index: number = this.currentIndex;
		if ([KEY_UP, KEY_DOWN, KEY_ENTER].indexOf(e.which) === -1) {
			return;
		}

		if (e.which === KEY_UP) {
			if (index === 0) {
				index = this.list.length - 1;
			} else {
				index -= 1;
			}
		}
		if (e.which === KEY_DOWN) {
			if (index === this.list.length - 1) {
				index = 0;
			} else {
				index += 1;
			}
		}

		if (e.which === KEY_ENTER) {
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
			Array.from(
				<NodeListOf<HTMLAnchorElement>>this.listBox.childNodes
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
			const a: HTMLElement = this.jodit.create.element('a');
			a.textContent = index + 1 + '. ' + html.replace(SPACE_REG_EXP, '');

			a.addEventListener('keydown', this.onKeyDown);

			a.setAttribute('href', 'javascript:void(0)');
			a.setAttribute('data-index', index.toString());
			a.setAttribute('tab-index', '-1');

			this.listBox && this.listBox.appendChild(a);
		});

		this.dialog && this.dialog.open();

		this.jodit.async.setTimeout(() => {
			this.selectIndex(0);
		}, 100);
	};

	private createDialog() {
		this.dialog = new Dialog(this.jodit);

		const pasteButton: HTMLAnchorElement = this.jodit.create.fromHTML(
			'<a href="javascript:void(0)" style="float:right;" class="jodit_button">' +
				'<span>' +
				this.jodit.i18n('Paste') +
				'</span>' +
				'</a>'
		) as HTMLAnchorElement;

		pasteButton.addEventListener('click', this.paste);

		const cancelButton: HTMLAnchorElement = this.jodit.create.fromHTML(
			'<a href="javascript:void(0)" style="float:right; margin-right: 10px;" class="jodit_button">' +
				'<span>' +
				this.jodit.i18n('Cancel') +
				'</span>' +
				'</a>'
		) as HTMLAnchorElement;

		cancelButton.addEventListener('click', this.dialog.close);

		this.container = this.jodit.create.div();
		this.container.classList.add('jodit_paste_storage');
		this.listBox = this.jodit.create.div();
		this.previewBox = this.jodit.create.div();

		this.container.appendChild(this.listBox);
		this.container.appendChild(this.previewBox);

		this.dialog.setTitle(this.jodit.i18n('Choose Content to Paste'));
		this.dialog.setContent(this.container);
		this.dialog.setFooter([pasteButton, cancelButton]);

		this.jodit.events.on(
			this.listBox,
			'click dblclick',
			(e: MouseEvent) => {
				const a: HTMLAnchorElement | null = e.target as HTMLAnchorElement;
				if (Dom.isTag(a, 'a') && a.hasAttribute('data-index')) {
					this.selectIndex(
						parseInt(a.getAttribute('data-index') || '0', 10)
					);
				}

				if (e.type === 'dblclick') {
					this.paste();
				}

				return false;
			},
			'a'
		);
	}

	afterInit() {
		this.jodit.events
			.off('afterCopy.paste-storage')
			.on('afterCopy.paste-storage', (html: string) => {
				if (this.list.indexOf(html) !== -1) {
					this.list.splice(this.list.indexOf(html), 1);
				}

				this.list.unshift(html);
				if (this.list.length > 5) {
					this.list.length = 5;
				}
			});

		this.jodit.registerCommand('showPasteStorage', {
			exec: this.showDialog,
			hotkeys: ['ctrl+shift+v', 'cmd+shift+v']
		});
	}

	beforeDestruct(): void {
		this.dialog && this.dialog.destruct();

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
