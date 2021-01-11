/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from '../../../types';
import { Plugin } from '../../../core/plugin';
import { InsertMode, PasteEvent } from '../config';
import { getAllTypes, getDataTransfer, pasteInsertHtml } from './helpers';

import {
	INSERT_AS_HTML,
	INSERT_AS_TEXT,
	INSERT_CLEAR_HTML,
	INSERT_ONLY_TEXT,
	TEXT_HTML,
	TEXT_PLAIN
} from '../../../core/constants';

import {
	isHTML,
	isHtmlFromWord,
	isString,
	trim,
	applyStyles,
	cleanFromWord,
	htmlspecialchars,
	LimitedStack,
	markOwner,
	nl2br,
	stripTags
} from '../../../core/helpers';

import { pluginKey as clipboardPluginKey } from '../clipboard';
import { Dom } from '../../../core/dom';
import { Confirm, Dialog } from '../../../modules/dialog';
import { Button } from '../../../core/ui/button';
import { autobind } from '../../../core/decorators';

type PastedValue = {
	html: string | Node;
	action?: InsertMode;
};

/**
 * Ask before paste HTML source
 */
export class paste extends Plugin {
	pasteStack: LimitedStack<PastedValue> = new LimitedStack(20);

	/** @override **/
	protected afterInit(jodit: IJodit) {
		jodit.e
			.on('paste.paste', this.onPaste)
			.on('pasteStack.paste', (item: PastedValue) =>
				this.pasteStack.push(item)
			);

		if (jodit.o.nl2brInPlainText) {
			this.j.e.on('processPaste.paste', this.onProcessPasteReplaceNl2Br);
		}
	}

	/**
	 * Paste event handler
	 * @param e
	 */
	@autobind
	private onPaste(e: PasteEvent): void | false {
		try {
			if (
				this.j.e.fire('beforePaste', e) === false ||
				this.customPasteProcess(e) === false
			) {
				e.preventDefault();
				return false;
			}

			this.defaultPasteProcess(e);
		} finally {
			this.j.e.fire('afterPaste', e);
		}
	}

	/**
	 * Process before paste
	 * @param event
	 */
	private customPasteProcess(e: PasteEvent): void | false {
		if (!this.j.o.processPasteHTML) {
			return;
		}

		const dt = getDataTransfer(e),
			texts = [dt?.getData(TEXT_HTML), dt?.getData(TEXT_PLAIN)];

		for (const text of texts) {
			if (
				isHTML(text) &&
				(this.processWordHTML(e, text) || this.processHTML(e, text))
			) {
				return false;
			}
		}
	}

	/**
	 * Default paster process
	 * @param event
	 */
	private defaultPasteProcess(e: PasteEvent): void {
		const dt = getDataTransfer(e);
		let text = dt?.getData(TEXT_HTML) || dt?.getData(TEXT_PLAIN);

		if (dt && text && trim(text) !== '') {
			const result = this.j.e.fire(
				'processPaste',
				e,
				text,
				getAllTypes(dt)
			);

			if (result !== undefined) {
				text = result;
			}

			if (isString(text) || Dom.isNode(text, this.j.ew)) {
				this.insertByType(e, text, this.j.o.defaultActionOnPaste);
			}

			e.preventDefault();
			e.stopPropagation();
		}
	}

	/**
	 * Try if text is Word's document fragment and try process this
	 * @param text
	 */
	private processWordHTML(e: PasteEvent, text: string): boolean {
		if (this.j.o.processPasteFromWord && isHtmlFromWord(text)) {
			if (this.j.o.askBeforePasteFromWord) {
				this.askInsertTypeDialog(
					'The pasted content is coming from a Microsoft Word/Excel document. ' +
						'Do you want to keep the format or clean it up?',
					'Word Paste Detected',
					insertType => {
						this.insertFromWordByType(e, text, insertType);
					}
				);
			} else {
				this.insertFromWordByType(
					e,
					text,
					this.j.o.defaultActionOnPasteFromWord ||
						this.j.o.defaultActionOnPaste
				);
			}

			return true;
		}

		return false;
	}

	/**
	 * Process usual HTML text fragment
	 * @param e
	 * @param html
	 */
	private processHTML(e: PasteEvent, html: string): boolean {
		if (this.j.o.askBeforePasteHTML) {
			const cached = this.pasteStack.find((cachedItem) => cachedItem.html === html);

			if (cached) {
				this.insertByType(
					e,
					html,
					cached.action || this.j.o.defaultActionOnPaste
				);
				return true;
			}

			this.askInsertTypeDialog(
				'Your code is similar to HTML. Keep as HTML?',
				'Paste as HTML',
				(insertType: InsertMode) => {
					this.insertByType(e, html, insertType);
				},
				'Insert as Text'
			);

			return true;
		}

		return false;
	}

	/**
	 * Clear extra styles and tags from Word's pasted text
	 *
	 * @param e
	 * @param html
	 * @param insertType
	 */
	private insertFromWordByType(
		e: PasteEvent,
		html: string,
		insertType: InsertMode
	) {
		switch (insertType) {
			case INSERT_AS_HTML: {
				html = applyStyles(html);

				if (this.j.o.beautifyHTML) {
					const value = this.j.events?.fire('beautifyHTML', html);

					if (isString(value)) {
						html = value;
					}
				}

				break;
			}

			case INSERT_AS_TEXT: {
				html = cleanFromWord(html);
				break;
			}

			case INSERT_ONLY_TEXT: {
				html = stripTags(cleanFromWord(html));
				break;
			}
		}

		pasteInsertHtml(e, this.j, html);
	}

	/**
	 * Insert HTML by option type
	 *
	 * @param e
	 * @param html
	 * @param action
	 */
	insertByType(e: PasteEvent, html: string | Node, action: InsertMode): void {
		this.pasteStack.push({ html, action });

		if (isString(html)) {
			this.j.buffer.set(clipboardPluginKey, html);

			switch (action) {
				case INSERT_CLEAR_HTML:
					html = cleanFromWord(html);
					break;

				case INSERT_ONLY_TEXT:
					html = stripTags(html);
					break;

				case INSERT_AS_TEXT:
					html = htmlspecialchars(html);
					break;

				default:
			}
		}

		pasteInsertHtml(e, this.j, html);
	}

	/**
	 * Make command dialog
	 *
	 * @param msg
	 * @param title
	 * @param callback
	 * @param clearButton
	 * @param insertText
	 * @private
	 */
	private askInsertTypeDialog(
		msg: string,
		title: string,
		callback: (yes: InsertMode) => void,
		clearButton: string = 'Clean',
		insertText: string = 'Insert only Text'
	): Dialog | void {
		if (
			this.j?.e?.fire(
				'beforeOpenPasteDialog',
				msg,
				title,
				callback,
				clearButton,
				insertText
			) === false
		) {
			return;
		}

		const dialog = Confirm(
			`<div style="word-break: normal; white-space: normal">${this.j.i18n(
				msg
			)}</div>`,
			this.j.i18n(title)
		);

		dialog.bindDestruct(this.j);

		markOwner(this.j, dialog.container);

		const keep = Button(this.j, {
			text: 'Keep',
			name: 'keep',
			status: 'primary',
			tabIndex: 0
		});

		const clear = Button(this.j, {
			text: clearButton,
			tabIndex: 0
		});

		const clear2 = Button(this.j, {
			text: insertText,
			tabIndex: 0
		});

		const cancel = Button(this.j, {
			text: 'Cancel',
			tabIndex: 0
		});

		keep.onAction(() => {
			dialog.close();
			callback && callback(INSERT_AS_HTML);
		});

		clear.onAction(() => {
			dialog.close();
			callback && callback(INSERT_AS_TEXT);
		});

		clear2.onAction(() => {
			dialog.close();
			callback && callback(INSERT_ONLY_TEXT);
		});

		cancel.onAction(() => {
			dialog.close();
		});

		dialog.setFooter([keep, clear, insertText ? clear2 : '', cancel]);

		keep.focus();

		this.j?.e?.fire(
			'afterOpenPasteDialog',
			dialog,
			msg,
			title,
			callback,
			clearButton,
			insertText
		);

		return dialog;
	}

	/**
	 * Replace all \n chars in plain text to br
	 *
	 * @param event
	 * @param text
	 * @param type
	 */
	@autobind
	private onProcessPasteReplaceNl2Br(
		event: PasteEvent,
		text: string,
		type: string
	): string | void {
		if (type === TEXT_PLAIN + ';' && !isHTML(text)) {
			return nl2br(text);
		}
	}

	/**
	 * Deprecated browser helper.
	 * TODO: need check all browser, now not used
	 * @param event
	 */
	useFakeDivBox(event: PasteEvent) {
		const div = this.j.c.div('', {
			tabindex: -1,
			contenteditable: true,
			style: {
				left: -9999,
				top: 0,
				width: 0,
				height: '100%',
				lineHeight: '140%',
				overflow: 'hidden',
				position: 'fixed',
				zIndex: 2147483647,
				wordBreak: 'break-all'
			}
		});

		this.j.container.appendChild(div);

		const selData = this.j.s.save();

		div.focus();
		let tick: number = 0;

		const removeFakeFocus = () => {
			Dom.safeRemove(div);
			this.j.selection && this.j.s.restore(selData);
		};

		const waitData = () => {
			tick += 1;

			// If data has been processes by browser, process it
			if (div.childNodes && div.childNodes.length > 0) {
				const pastedData = div.innerHTML;
				removeFakeFocus();
				this.processHTML(event, pastedData);
				return;
			}

			if (tick < 5) {
				this.j.async.setTimeout(waitData, 20);
			} else {
				removeFakeFocus();
			}
		};

		waitData();
	}

	/** @override **/
	protected beforeDestruct(jodit: IJodit) {
		jodit.e.off('paste.paste', this.onPaste);
	}
}
