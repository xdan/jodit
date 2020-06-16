/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../../config';
import {
	INSERT_AS_HTML,
	INSERT_AS_TEXT,
	INSERT_CLEAR_HTML,
	INSERT_ONLY_TEXT,
	IS_IE,
	TEXT_HTML,
	TEXT_PLAIN
} from '../../core/constants';

import { Confirm, Dialog, Alert } from '../../modules/dialog/';

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
	isArray
} from '../../core/helpers/';

import { Dom } from '../../core/dom';
import { IControlType, IJodit } from '../../types';
import { nl2br } from '../../core/helpers';
import { pluginKey as clipboardPluginKey } from './cut';
import { Button } from '../../core/ui/button/button';

declare module '../../config' {
	interface Config {
		/**
		 * Ask before paste HTML in WYSIWYG mode
		 */
		askBeforePasteHTML: boolean;
		processPasteHTML: boolean;

		askBeforePasteFromWord: boolean;
		processPasteFromWord: boolean;

		/**
		 * Inserts HTML line breaks before all newlines in a string
		 */
		nl2brInPlainText: boolean;

		/**
		 * Default insert method
		 */
		defaultActionOnPaste: string;
	}
}

Config.prototype.askBeforePasteHTML = true;
Config.prototype.processPasteHTML = true;

Config.prototype.askBeforePasteFromWord = true;
Config.prototype.processPasteFromWord = true;

Config.prototype.nl2brInPlainText = true;
Config.prototype.defaultActionOnPaste = INSERT_AS_HTML;

export const getDataTransfer = (
	event: ClipboardEvent | DragEvent
): DataTransfer | null => {
	if ((event as ClipboardEvent).clipboardData) {
		return (event as ClipboardEvent).clipboardData;
	}

	try {
		return (event as DragEvent).dataTransfer || new DataTransfer();
	} catch {
		return null;
	}
};

Config.prototype.controls.paste = {
	tooltip: 'Paste from clipboard',

	async exec(editor: IJodit) {
		editor.s.focus();

		let text = '',
			error = true;

		if (error) {
			text = editor.buffer.get<string>(clipboardPluginKey) || '';
			error = text.length === 0;
		}

		if (error && navigator.clipboard) {
			try {
				const items = await (navigator.clipboard as any).read();

				if (items && items.length) {
					const textBlob = await items[0].getType('text/plain');
					text = await new Response(textBlob).text();
				}
			} catch {}

			if (error) {
				try {
					text = await navigator.clipboard.readText();
					error = false;
				} catch {}
			}
		}

		if (error) {
			const value = editor.value;
			editor.ed.execCommand('paste');
			error = value !== editor.value;
		}

		if (text) {
			editor.s.insertHTML(text);
		} else {
			if (error) {
				Alert(
					editor.i18n(
						"Your browser doesn't support direct access to the clipboard."
					),
					() => {
						editor.s.focus();
					}
				).bindDestruct(editor);
			}
		}
	}
} as IControlType;

/**
 * Ask before paste HTML source
 */
export function paste(editor: IJodit) {
	const opt = editor.options,
		clearOrKeep = (
			msg: string,
			title: string,
			callback: (yes: boolean | number) => void,
			clearButton: string = 'Clean',
			clear2Button: string = 'Insert only Text'
		): Dialog | void => {
			if (
				editor.events &&
				editor.e.fire(
					'beforeOpenPasteDialog',
					msg,
					title,
					callback,
					clearButton,
					clear2Button
				) === false
			) {
				return;
			}

			const dialog = Confirm(
				`<div style="word-break: normal; white-space: normal">${msg}</div>`,
				title,
				callback
			);

			dialog.bindDestruct(editor);

			markOwner(editor, dialog.container);

			const keep = Button(editor, '', 'Keep');
			const clear = Button(editor, '', clearButton);
			const clear2 = Button(editor, '', clear2Button);
			const cancel = Button(editor, '', 'Cancel');

			keep.onAction(() => {
				dialog.close();
				callback && callback(true);
			});
			clear.onAction(() => {
				dialog.close();
				callback && callback(false);
			});
			clear2.onAction(() => {
				dialog.close();
				callback && callback(0);
			});
			cancel.onAction(() => {
				dialog.close();
			});

			dialog.setFooter([keep, clear, clear2Button ? clear2 : '', cancel]);

			editor.events?.fire(
				'afterOpenPasteDialog',
				dialog,
				msg,
				title,
				callback,
				clearButton,
				clear2Button
			);

			return dialog;
		};

	const insertByType = (html: string | Node, subtype: string) => {
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

		if (editor.isInDestruct) {
			return;
		}

		if (isString(html)) {
			editor.buffer.set(clipboardPluginKey, html);
		}

		editor.s.insertHTML(html);
	};

	const insertHTML = (
		html: string,
		event: DragEvent | ClipboardEvent
	): void | false => {
		const buffer = editor.buffer.get(clipboardPluginKey);

		if (isHTML(html) && buffer !== trimFragment(html)) {
			html = trimFragment(html);

			const pasteHTMLByType = (insertType: string) => {
				if (event.type === 'drop') {
					editor.s.insertCursorAtPoint(
						(event as DragEvent).clientX,
						(event as DragEvent).clientY
					);
				}

				insertByType(html, insertType);

				editor.setEditorValue();
			};

			if (opt.askBeforePasteHTML) {
				clearOrKeep(
					editor.i18n('Your code is similar to HTML. Keep as HTML?'),
					editor.i18n('Paste as HTML'),
					(agree: boolean | number) => {
						let insertType: string = INSERT_AS_HTML;

						if (agree === false) {
							insertType = INSERT_AS_TEXT;
						}

						if (agree === 0) {
							insertType = INSERT_ONLY_TEXT;
						}

						pasteHTMLByType(insertType);
					},
					'Insert as Text'
				);
			} else {
				pasteHTMLByType(opt.defaultActionOnPaste);
			}

			return false;
		}
	};

	const trimFragment = (html: string): string => {
		const start: number = html.search(/<!--StartFragment-->/i);

		if (start !== -1) {
			html = html.substr(start + 20);
		}

		const end: number = html.search(/<!--EndFragment-->/i);

		if (end !== -1) {
			html = html.substr(0, end);
		}

		return html;
	};

	const beforePaste = (event: ClipboardEvent | DragEvent): false | void => {
		const dt = getDataTransfer(event);

		if (!dt || !event || !dt.getData) {
			return;
		}

		if (dt.getData(TEXT_HTML)) {
			const processHTMLData = (html: string): void | false => {
				const buffer = editor.buffer.get(clipboardPluginKey);

				if (
					opt.processPasteHTML &&
					isHTML(html) &&
					buffer !== trimFragment(html)
				) {
					if (opt.processPasteFromWord && isHtmlFromWord(html)) {
						const pasteFromWordByType = (method: string) => {
							if (method === INSERT_AS_HTML) {
								html = applyStyles(html);

								if (opt.beautifyHTML) {
									const value = editor.events?.fire(
										'beautifyHTML',
										html
									);

									if (isString(value)) {
										html = value;
									}
								}
							}

							if (method === INSERT_AS_TEXT) {
								html = cleanFromWord(html);
							}

							if (method === INSERT_ONLY_TEXT) {
								html = stripTags(cleanFromWord(html));
							}

							editor.s.insertHTML(html);
							editor.setEditorValue();
						};

						if (opt.askBeforePasteFromWord) {
							clearOrKeep(
								editor.i18n(
									'The pasted content is coming from a Microsoft Word/Excel document. ' +
										'Do you want to keep the format or clean it up?'
								),

								editor.i18n('Word Paste Detected'),
								(agree: number | boolean) => {
									let insertType: string = INSERT_AS_HTML;

									if (agree === false) {
										insertType = INSERT_AS_TEXT;
									}

									if (agree === 0) {
										insertType = INSERT_ONLY_TEXT;
									}

									pasteFromWordByType(insertType);
								}
							);
						} else {
							pasteFromWordByType(opt.defaultActionOnPaste);
						}
					} else {
						insertHTML(html, event);
					}

					return false;
				}
			};

			if (dt.types && Array.from(dt.types).includes(TEXT_HTML)) {
				return processHTMLData(dt.getData(TEXT_HTML));
			}

			if (event.type !== 'drop') {
				const div = editor.c.div('', {
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

				editor.container.appendChild(div);

				const selData = editor.s.save();

				div.focus();
				let tick: number = 0;

				const removeFakeFocus = () => {
					Dom.safeRemove(div);
					editor.selection && editor.s.restore(selData);
				};

				const waitData = () => {
					tick += 1;

					// If data has been processes by browser, process it
					if (div.childNodes && div.childNodes.length > 0) {
						const pastedData = div.innerHTML;

						removeFakeFocus();

						if (processHTMLData(pastedData) !== false) {
							editor.s.insertHTML(pastedData);
						}

						return;
					}

					if (tick < 5) {
						editor.async.setTimeout(waitData, 20);
					} else {
						removeFakeFocus();
					}
				};

				waitData();
			}
		}

		if (dt.getData(TEXT_PLAIN)) {
			return insertHTML(dt.getData(TEXT_PLAIN), event);
		}
	};

	editor.e
		.off('paste.paste')
		.on('paste.paste', (event: ClipboardEvent | DragEvent):
			| false
			| void => {
			/**
			 * Triggered before pasting something into the Jodit Editor
			 *
			 * @event beforePaste
			 * @param {ClipboardEvent} event
			 * @return Returning false in the handler assigned toWYSIWYG the event will cancel the current action.
			 * @example
			 * ```javascript
			 * var editor = new Jodit("#redactor");
			 * editor.e.on('beforePaste', function (event) {
			 *     return false; // deny paste
			 * });
			 * ```
			 */
			if (
				beforePaste(event) === false ||
				editor.e.fire('beforePaste', event) === false
			) {
				event.preventDefault();
				return false;
			}

			const dt = getDataTransfer(event);

			if (event && dt) {
				const types: ReadonlyArray<string> | string = dt.types;

				let types_str: string = '';

				if (isArray(types) || type(types) === 'domstringlist') {
					for (let i = 0; i < types.length; i += 1) {
						types_str += types[i] + ';';
					}
				} else {
					types_str = (types || TEXT_PLAIN).toString() + ';';
				}

				const getText = (): string | null => {
					if (/text\/html/i.test(types_str)) {
						return dt.getData('text/html');
					}

					if (/text\/rtf/i.test(types_str) && browser('safari')) {
						return dt.getData('text/rtf');
					}

					if (/text\/plain/i.test(types_str) && !browser('mozilla')) {
						return dt.getData(TEXT_PLAIN);
					}

					if (/text/i.test(types_str) && IS_IE) {
						return dt.getData(TEXT_PLAIN);
					}

					return null;
				};

				let clipboard_html = getText();

				if (
					Dom.isNode(clipboard_html, editor.ew) ||
					(clipboard_html && trim(clipboard_html) !== '')
				) {
					/**
					 * Triggered after the content is pasted from the clipboard into the Jodit.
					 * If a string is returned the new string will be used as the pasted content.
					 *
					 * @event beforePaste
					 * @param {ClipboardEvent} event
					 * @return Return {string|undefined}
					 * @example
					 * ```javascript
					 * var editor = new Jodit("#redactor");
					 * editor.e.on('beforePaste', function (event) {
					 *     return false; // deny paste
					 * });
					 * ```
					 */
					clipboard_html = trimFragment(clipboard_html);

					const buffer = editor.buffer.get(clipboardPluginKey);

					if (buffer !== clipboard_html) {
						const result = editor.e.fire(
							'processPaste',
							event,
							clipboard_html,
							types_str
						);

						if (result !== undefined) {
							clipboard_html = result;
						}
					}

					if (
						isString(clipboard_html) ||
						Dom.isNode(clipboard_html, editor.ew)
					) {
						if (event.type === 'drop') {
							editor.s.insertCursorAtPoint(
								(event as DragEvent).clientX,
								(event as DragEvent).clientY
							);
						}

						insertByType(clipboard_html, opt.defaultActionOnPaste);
					}

					event.preventDefault();
					event.stopPropagation();
				}
			}

			/**
			 * Triggered after pasting something into the Jodit
			 *
			 * @event afterPaste
			 * @param {ClipboardEvent} event
			 * @return Return {string|undefined}
			 * @example
			 * ```javascript
			 * var editor = new Jodit("#redactor");
			 * editor.e.on('afterPaste', function (event) {
			 *     return false; // deny paste
			 * });
			 * ```
			 */
			if (editor.e.fire('afterPaste', event) === false) {
				return false;
			}
		});

	if (opt.nl2brInPlainText) {
		editor.e
			.off('processPaste.paste')
			.on(
				'processPaste.paste',
				(
					event: ClipboardEvent,
					text: string,
					type: string
				): string | void => {
					if (type === TEXT_PLAIN + ';' && !isHTML(text)) {
						return nl2br(text);
					}
				}
			);
	}
}
