/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit, ISourceEditor } from '../../../../types';
import * as consts from '../../../../constants';
import { isString, loadNext } from '../../../../modules/helpers';
import { SourceEditor } from '../SourceEditor';

export class AceEditor extends SourceEditor<AceAjax.Editor>
	implements ISourceEditor {
	className = 'jodit_ace_editor';

	private aceExists() {
		return (this.jodit.ownerWindow as any).ace !== undefined;
	}

	/**
	 * Proxy Method
	 * @param e
	 * @private
	 */
	private proxyOnFocus = (e: MouseEvent) => {
		this.jodit.events.fire('focus', e);
	};

	private proxyOnMouseDown = (e: MouseEvent) => {
		this.jodit.events.fire('mousedown', e);
	};

	private get undoManager(): null | AceAjax.UndoManager {
		return this.instance
			? this.instance.getSession().getUndoManager()
			: null;
	}

	private updateButtons() {
		if (
			this.undoManager &&
			this.jodit.getRealMode() === consts.MODE_SOURCE
		) {
			this.jodit.events.fire('canRedo', this.undoManager.hasRedo());
			this.jodit.events.fire('canUndo', this.undoManager.hasUndo());
		}
	}

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

	private getRowColumnIndices(
		characterIndex: number
	): { row: number; column: number } {
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

	private setSelectionRangeIndices(start: number, end: number) {
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
		const tryInitAceEditor = () => {
			if (this.instance !== undefined || !this.aceExists()) {
				return;
			}

			const fakeMirror = this.jodit.create.div(
				'jodit_source_mirror-fake'
			);

			this.container.appendChild(fakeMirror);

			this.instance = ((editor.ownerWindow as any)
				.ace as AceAjax.Ace).edit(fakeMirror);

			this.instance.setTheme(
				editor.options.sourceEditorNativeOptions.theme
			);

			this.instance.renderer.setShowGutter(
				editor.options.sourceEditorNativeOptions.showGutter
			);

			this.instance
				.getSession()
				.setMode(editor.options.sourceEditorNativeOptions.mode);

			this.instance.setHighlightActiveLine(
				editor.options.sourceEditorNativeOptions.highlightActiveLine
			);

			this.instance.getSession().setUseWrapMode(true);
			this.instance.setOption('indentedSoftWrap', false);
			this.instance.setOption(
				'wrap',
				editor.options.sourceEditorNativeOptions.wrap
			);

			this.instance.getSession().setUseWorker(false);

			this.instance.$blockScrolling = Infinity;

			this.instance.on('change', this.toWYSIWYG as any);
			this.instance.on('focus', this.proxyOnFocus);
			this.instance.on('mousedown', this.proxyOnMouseDown);

			if (editor.getRealMode() !== consts.MODE_WYSIWYG) {
				this.setValue(this.getValue());
			}

			const onResize = this.jodit.async.debounce(() => {
				if (editor.isInDestruct) {
					return;
				}

				if (editor.options.height !== 'auto') {
					this.instance.setOption(
						'maxLines',
						editor.workplace.offsetHeight /
							this.instance.renderer.lineHeight
					);
				} else {
					this.instance.setOption('maxLines', Infinity);
				}

				this.instance.resize();
			}, this.jodit.defaultTimeout * 2);

			editor.events.on('afterResize afterSetMode', onResize);

			onResize();

			this.onReady();
		};

		editor.events
			.on('afterSetMode', () => {
				if (
					editor.getRealMode() !== consts.MODE_SOURCE &&
					editor.getMode() !== consts.MODE_SPLIT
				) {
					return;
				}

				this.fromWYSIWYG();
				tryInitAceEditor();
			})
			.on('beforeCommand', (command: string): false | void => {
				if (
					editor.getRealMode() !== consts.MODE_WYSIWYG &&
					(command === 'redo' || command === 'undo') &&
					this.undoManager
				) {
					if (
						(this.undoManager as any)[
							'has' +
								command.substr(0, 1).toUpperCase() +
								command.substr(1)
						]
					) {
						this.instance[command]();
					}
					this.updateButtons();
					return false;
				}
			});

		tryInitAceEditor();

		// global add ace editor in browser
		if (!this.aceExists()) {
			loadNext(editor, editor.options.sourceEditorCDNUrlsJS).then(() => {
				if (!editor.isInDestruct) {
					tryInitAceEditor();
				}
			});
		}
	}

	destruct(): any {
		this.instance.off('change', this.toWYSIWYG);
		this.instance.off('focus', this.proxyOnFocus);
		this.instance.off('mousedown', this.proxyOnMouseDown);
		this.instance.destroy();

		this.jodit?.events?.off('aceInited.source');
	}

	setValue(value: string) {
		if (this.jodit.options.beautifyHTML) {
			const html = this.jodit.events.fire('beautifyHTML', value);

			if (isString(html)) {
				value = html;
			}
		}

		this.instance.setValue(value);

		this.instance.clearSelection();
		this.updateButtons();
	}

	getValue() {
		return this.instance.getValue();
	}

	setReadOnly(isReadOnly: boolean): void {
		this.instance.setReadOnly(isReadOnly);
	}

	focus() {
		this.instance.focus();
	}

	getSelectionStart(): number {
		const range = this.instance.selection.getRange();

		return this.getIndexByRowColumn(range.start.row, range.start.column);
	}

	getSelectionEnd(): number {
		const range = this.instance.selection.getRange();

		return this.getIndexByRowColumn(range.end.row, range.end.column);
	}

	selectAll() {
		this.instance.selection.selectAll();
	}

	insertRaw(html: string) {
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

	setSelectionRange(start: number, end: number) {
		this.setSelectionRangeIndices(start, end);
	}

	setPlaceHolder(title: string): void {
		// ACE does not support placeholder
	}
}
