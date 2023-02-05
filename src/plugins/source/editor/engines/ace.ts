/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/source
 */

import type { IJodit, ISourceEditor } from 'jodit/types';
import * as constants from 'jodit/core/constants';
import { isString, loadNext } from 'jodit/core/helpers';

import { SourceEditor } from '../sourceEditor';

export class AceEditor
	extends SourceEditor<AceAjax.Editor>
	implements ISourceEditor
{
	override className = 'jodit_ace_editor';

	private aceExists(): boolean {
		return (this.j.ow as any).ace !== undefined;
	}

	/**
	 * Proxy Method
	 */
	private proxyOnBlur = (e: MouseEvent): void => {
		this.j.e.fire('blur', e);
	};

	private proxyOnFocus = (e: MouseEvent): void => {
		this.j.e.fire('focus', e);
	};

	private proxyOnMouseDown = (e: MouseEvent): void => {
		this.j.e.fire('mousedown', e);
	};

	private getLastColumnIndex(row: number): number {
		return this.instance.session.getLine(row).length;
	}

	private getLastColumnIndices(): number[] {
		const rows = this.instance.session.getLength();
		const lastColumnIndices: number[] = [];

		let lastColIndex = 0;

		for (let i = 0; i < rows; i++) {
			lastColIndex += this.getLastColumnIndex(i);

			if (i > 0) {
				lastColIndex += 1;
			}

			lastColumnIndices[i] = lastColIndex;
		}

		return lastColumnIndices;
	}

	private getRowColumnIndices(characterIndex: number): {
		row: number;
		column: number;
	} {
		const lastColumnIndices: number[] = this.getLastColumnIndices();

		if (characterIndex <= lastColumnIndices[0]) {
			return { row: 0, column: characterIndex };
		}

		let row = 1;

		for (let i = 1; i < lastColumnIndices.length; i++) {
			if (characterIndex > lastColumnIndices[i]) {
				row = i + 1;
			}
		}

		const column = characterIndex - lastColumnIndices[row - 1] - 1;

		return { row, column };
	}

	private setSelectionRangeIndices(start: number, end: number): void {
		const startRowColumn = this.getRowColumnIndices(start);
		const endRowColumn = this.getRowColumnIndices(end);

		this.instance.getSelection().setSelectionRange({
			start: startRowColumn,
			end: endRowColumn
		});
	}

	private getIndexByRowColumn(row: number, column: number): number {
		const lastColumnIndices: number[] = this.getLastColumnIndices();

		return lastColumnIndices[row] - this.getLastColumnIndex(row) + column;
	}

	init(editor: IJodit): any {
		const tryInitAceEditor = (): void => {
			if (this.instance !== undefined || !this.aceExists()) {
				return;
			}

			const fakeMirror = this.j.c.div('jodit-source__mirror-fake');

			this.container.appendChild(fakeMirror);

			const ace = (editor.ow as any).ace as AceAjax.Ace;

			this.instance = ace.edit(fakeMirror);

			this.instance.setTheme(editor.o.sourceEditorNativeOptions.theme);
			this.instance.renderer.setShowGutter(
				editor.o.sourceEditorNativeOptions.showGutter
			);

			this.instance
				.getSession()
				.setMode(editor.o.sourceEditorNativeOptions.mode);

			this.instance.setHighlightActiveLine(
				editor.o.sourceEditorNativeOptions.highlightActiveLine
			);

			this.instance.getSession().setUseWrapMode(true);
			this.instance.setOption('indentedSoftWrap', false);
			this.instance.setOption(
				'wrap',
				editor.o.sourceEditorNativeOptions.wrap
			);

			this.instance.getSession().setUseWorker(false);

			this.instance.$blockScrolling = Infinity;

			this.instance.on('change', this.toWYSIWYG as any);
			this.instance.on('focus', this.proxyOnFocus);
			this.instance.on('mousedown', this.proxyOnMouseDown);
			this.instance.on('blur', this.proxyOnBlur);

			if (editor.getRealMode() !== constants.MODE_WYSIWYG) {
				this.setValue(this.getValue());
			}

			const onResize = this.j.async.debounce(() => {
				if (editor.isInDestruct) {
					return;
				}

				if (editor.o.height !== 'auto') {
					this.instance.setOption(
						'maxLines',
						editor.workplace.offsetHeight /
							this.instance.renderer.lineHeight
					);
				} else {
					this.instance.setOption('maxLines', Infinity);
				}

				this.instance.resize();
			}, this.j.defaultTimeout * 2);

			editor.e.on('afterResize afterSetMode', onResize);

			onResize();

			this.onReady();
		};

		editor.e.on('afterSetMode', () => {
			if (
				editor.getRealMode() !== constants.MODE_SOURCE &&
				editor.getMode() !== constants.MODE_SPLIT
			) {
				return;
			}

			this.fromWYSIWYG();
			tryInitAceEditor();
		});

		tryInitAceEditor();

		// global add ace editor in browser
		if (!this.aceExists()) {
			loadNext(editor, editor.o.sourceEditorCDNUrlsJS)
				.then(() => {
					if (!editor.isInDestruct) {
						tryInitAceEditor();
					}
				})
				.catch(() => null);
		}
	}

	destruct(): any {
		this.instance.off('change', this.toWYSIWYG);
		this.instance.off('focus', this.proxyOnFocus);
		this.instance.off('mousedown', this.proxyOnMouseDown);
		this.instance.destroy();

		this.j?.events?.off('aceInited.source');
	}

	setValue(value: string): void {
		if (!this.j.o.editHTMLDocumentMode && this.j.o.beautifyHTML) {
			const html = this.j.e.fire('beautifyHTML', value);

			if (isString(html)) {
				value = html;
			}
		}

		this.instance.setValue(value);

		this.instance.clearSelection();
	}

	getValue(): string {
		return this.instance.getValue();
	}

	setReadOnly(isReadOnly: boolean): void {
		this.instance.setReadOnly(isReadOnly);
	}

	get isFocused(): boolean {
		return this.instance.isFocused();
	}

	focus(): void {
		this.instance.focus();
	}

	blur(): void {
		this.instance.blur();
	}

	getSelectionStart(): number {
		const range = this.instance.selection.getRange();

		return this.getIndexByRowColumn(range.start.row, range.start.column);
	}

	getSelectionEnd(): number {
		const range = this.instance.selection.getRange();

		return this.getIndexByRowColumn(range.end.row, range.end.column);
	}

	selectAll(): void {
		this.instance.selection.selectAll();
	}

	insertRaw(html: string): void {
		const start = this.instance.selection.getCursor(),
			end = this.instance.session.insert(start, html);

		this.instance.selection.setRange(
			{
				start,
				end
			} as AceAjax.Range,
			false
		);
	}

	setSelectionRange(start: number, end: number): void {
		this.setSelectionRangeIndices(start, end);
	}

	setPlaceHolder(title: string): void {
		// ACE does not support placeholder
		// title
	}

	replaceUndoManager(): void {
		const { history } = this.jodit;

		this.instance.commands.addCommand({
			name: 'Undo',
			bindKey: { win: 'Ctrl-Z', mac: 'Command-Z' },
			exec: () => {
				history.undo();
			}
		});

		this.instance.commands.addCommand({
			name: 'Redo',
			bindKey: { win: 'Ctrl-Shift-Z', mac: 'Command-Shift-Z' },
			exec: () => {
				history.redo();
			}
		});
	}
}
