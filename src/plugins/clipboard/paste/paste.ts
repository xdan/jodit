/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import autobind from 'autobind-decorator';

import { IJodit, Nullable } from '../../../types';

import {
	INSERT_AS_HTML,
	INSERT_CLEAR_HTML,
	INSERT_ONLY_TEXT,
	IS_IE,
	TEXT_HTML,
	INSERT_AS_TEXT,
	TEXT_PLAIN
} from '../../../core/constants';

import { Confirm, Dialog } from '../../../modules/dialog/';

import {
	applyStyles,
	browser,
	cleanFromWord,
	htmlspecialchars,
	isHTML,
	isHtmlFromWord,
	trim,
	type,
	stripTags,
	isString,
	markOwner,
	isArray,
	nl2br
} from '../../../core/helpers/';

import { Dom } from '../../../core/dom';
import { Plugin } from '../../../core/plugin';
import { pluginKey as clipboardPluginKey } from '../cut';
import { Button } from '../../../core/ui';
import { getDataTransfer, pasteInsertHtml } from './helpers';
import { InsertMode, PasteEvent } from '../config';

/**
 * Ask before paste HTML source
 */
export class paste extends Plugin {
	/** @override **/
	protected afterInit(jodit: IJodit) {
		jodit.e.on('paste.paste', this.onPaste);

		if (jodit.o.nl2brInPlainText) {
			this.j.e.on('processPaste.paste', this.onProcessPasteReplaceNl2Br);
		}
	}

	/**
	 * Process Paste event
	 * @param event
	 */
	@autobind
	private onPaste(event: PasteEvent): false | void {
		if (
			this.j.e.fire('beforePaste', event) === false ||
			this.customPasteProcess(event) === false
		) {
			event.preventDefault();
			return false;
		}

		this.defaultPasteProcess(event);

		if (this.j.e.fire('afterPaste', event) === false) {
			return false;
		}
	}

	/**
	 * Process before paste
	 * @param event
	 */
	private customPasteProcess(event: PasteEvent): false | void {
		const dt = getDataTransfer(event);

		if (!dt || !event || !dt.getData) {
			return;
		}

		if (dt.getData(TEXT_HTML)) {
			if (dt.types && Array.from(dt.types).includes(TEXT_HTML)) {
				return this.processHTMLData(dt.getData(TEXT_HTML), event);
			}

			if (event.type !== 'drop') {
				this.useFakeDivBox(event);
			}
		}

		if (dt.getData(TEXT_PLAIN)) {
			return this.insertHTML(dt.getData(TEXT_PLAIN), event);
		}
	}

	/**
	 * Default paster process
	 * @param event
	 */
	private defaultPasteProcess(event: PasteEvent) {
		const dt = getDataTransfer(event);

		if (event && dt) {
			let html = this.getText(dt, this.getAllTypes(dt));

			if (html && trim(html) !== '') {
				html = this.trimFragment(html);

				const buffer = this.j.buffer.get(clipboardPluginKey);

				if (buffer !== html) {
					const result = this.j.e.fire(
						'processPaste',
						event,
						html,
						this.getAllTypes(dt)
					);

					if (result !== undefined) {
						html = result;
					}
				}

				if (isString(html)) {
					this.pasteHTMLByType(
						html,
						this.j.o.defaultActionOnPaste,
						event
					);
				}

				event.preventDefault();
				event.stopPropagation();
			}
		}
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
	private clearOrKeep(
		msg: string,
		title: string,
		callback: (yes: InsertMode) => void,
		clearButton: string = 'Clean',
		insertText: string = 'Insert only Text'
	): Dialog | void {
		if (
			this.j.e &&
			this.j.e.fire(
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

		const keep = Button(this.j, '', 'Keep');
		const clear = Button(this.j, '', clearButton);
		const clear2 = Button(this.j, '', insertText);
		const cancel = Button(this.j, '', 'Cancel');

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

		this.j.e?.fire(
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
	 * Insert HTML by option type
	 *
	 * @param html
	 * @param subtype
	 */
	insertByType(html: string | Node, subtype: InsertMode): void {
		if (isString(html)) {
			switch (subtype) {
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

		if (this.j.isInDestruct) {
			return;
		}

		if (isString(html)) {
			this.j.buffer.set(clipboardPluginKey, html);
		}

		pasteInsertHtml(this.j, html);
	}

	/**
	 * Paste HTML
	 * @param html
	 */
	insertHTML(html: string, event: DragEvent | ClipboardEvent): void | false {
		const buffer = this.j.buffer.get(clipboardPluginKey);

		if (isHTML(html) && buffer !== this.trimFragment(html)) {
			html = this.trimFragment(html);

			if (this.j.o.askBeforePasteHTML) {
				this.clearOrKeep(
					'Your code is similar to HTML. Keep as HTML?',
					'Paste as HTML',
					(insertType: InsertMode) => {
						this.pasteHTMLByType(html, insertType, event);
					},
					'Insert as Text'
				);
			} else {
				this.pasteHTMLByType(
					html,
					this.j.o.defaultActionOnPaste,
					event
				);
			}

			return false;
		}
	}

	/**
	 * Remove special HTML comments
	 * @param html
	 */
	private trimFragment(html: string): string {
		const start: number = html.search(/<!--StartFragment-->/i);

		if (start !== -1) {
			html = html.substr(start + 20);
		}

		const end: number = html.search(/<!--EndFragment-->/i);

		if (end !== -1) {
			html = html.substr(0, end);
		}

		return html;
	}

	/**
	 * Get string from DataTransfer
	 *
	 * @param dt
	 * @param typesStr
	 */
	private getText(dt: DataTransfer, typesStr: string): Nullable<string> {
		if (/text\/html/i.test(typesStr)) {
			return dt.getData('text/html');
		}

		if (/text\/rtf/i.test(typesStr) && browser('safari')) {
			return dt.getData('text/rtf');
		}

		if (/text\/plain/i.test(typesStr) && !browser('mozilla')) {
			return dt.getData(TEXT_PLAIN);
		}

		if (/text/i.test(typesStr) && IS_IE) {
			return dt.getData(TEXT_PLAIN);
		}

		return null;
	}

	/** @override **/
	protected beforeDestruct(jodit: IJodit) {
		this.j.e.off('.paste');
	}

	private processHTMLData(
		html: string,
		event: DragEvent | ClipboardEvent
	): void | false {
		const buffer = this.j.buffer.get(clipboardPluginKey);

		if (
			this.j.o.processPasteHTML &&
			isHTML(html) &&
			buffer !== this.trimFragment(html)
		) {
			if (this.j.o.processPasteFromWord && isHtmlFromWord(html)) {
				if (this.j.o.askBeforePasteFromWord) {
					this.clearOrKeep(
						'The pasted content is coming from a Microsoft Word/Excel document. ' +
							'Do you want to keep the format or clean it up?',
						'Word Paste Detected',
						(insertType: InsertMode) => {
							this.pasteFromWordByType(html, insertType);
						}
					);
				} else {
					this.pasteFromWordByType(
						html,
						this.j.o.defaultActionOnPaste
					);
				}
			} else {
				this.insertHTML(html, event);
			}

			return false;
		}
	}

	private useFakeDivBox(event: PasteEvent) {
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

				if (this.processHTMLData(pastedData, event) !== false) {
					pasteInsertHtml(this.j, pastedData);
				}

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

	private pasteHTMLByType(
		html: string,
		insertType: InsertMode,
		event: PasteEvent
	) {
		if (event.type === 'drop') {
			this.j.s.insertCursorAtPoint(
				(event as DragEvent).clientX,
				(event as DragEvent).clientY
			);
		}

		this.insertByType(html, insertType);

		this.j.setEditorValue();
	}

	private pasteFromWordByType(html: string, insertType: InsertMode) {
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

		pasteInsertHtml(this.j, html);

		this.j.setEditorValue();
	}

	private getAllTypes(dt: DataTransfer): string {
		const types: ReadonlyArray<string> | string = dt.types;

		let types_str: string = '';

		if (isArray(types) || type(types) === 'domstringlist') {
			for (let i = 0; i < types.length; i += 1) {
				types_str += types[i] + ';';
			}
		} else {
			types_str = (types || TEXT_PLAIN).toString() + ';';
		}

		return types_str;
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
}
