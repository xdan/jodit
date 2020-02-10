/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as consts from '../../constants';
import { MODE_SOURCE } from '../../constants';
import { Plugin } from '../../modules/Plugin';
import { IJodit, ISourceEditor, markerInfo } from '../../types';
import { Dom } from '../../modules/Dom';
import { isString, loadNext } from '../../modules/helpers';
import { createSourceEditor } from './editor/factory';

/**
 * Plug-in change simple textarea on CodeMirror editor in Source code mode
 *
 * @module source
 */
export class source extends Plugin {
	sourceEditor!: ISourceEditor;

	private mirrorContainer!: HTMLDivElement;

	private __lock = false;
	private __oldMirrorValue = '';

	private tempMarkerStart = '{start-jodit-selection}';
	private tempMarkerStartReg = /{start-jodit-selection}/g;
	private tempMarkerEnd = '{end-jodit-selection}';
	private tempMarkerEndReg = /{end-jodit-selection}/g;

	private selInfo: markerInfo[] = [];

	private insertHTML = (html: string) => {
		this.sourceEditor.insertRaw(html);

		this.toWYSIWYG();
	};

	private fromWYSIWYG = (force: boolean | string = false) => {
		if (!this.__lock || force === true) {
			this.__lock = true;
			const new_value = this.jodit.getEditorValue(false);

			if (new_value !== this.getMirrorValue()) {
				this.setMirrorValue(new_value);
			}

			this.__lock = false;
		}
	};

	private toWYSIWYG = () => {
		if (this.__lock) {
			return;
		}

		const value: string = this.getMirrorValue();

		if (value === this.__oldMirrorValue) {
			return;
		}

		this.__lock = true;
		this.jodit.setEditorValue(value);
		this.__lock = false;
		this.__oldMirrorValue = value;
	};

	private getNormalPosition = (pos: number, str: string): number => {
		let start: number = pos;

		while (start > 0) {
			start--;

			if (
				str[start] === '<' &&
				str[start + 1] !== undefined &&
				str[start + 1].match(/[\w\/]+/i)
			) {
				return start;
			}

			if (str[start] === '>') {
				return pos;
			}
		}

		return pos;
	};

	private __clear = (str: string): string =>
		str.replace(consts.INVISIBLE_SPACE_REG_EXP, '');

	private selectAll = () => {
		this.sourceEditor.selectAll();
	};

	private onSelectAll = (command: string): void | false => {
		if (
			command.toLowerCase() === 'selectall' &&
			this.jodit.getRealMode() === MODE_SOURCE
		) {
			this.selectAll();
			return false;
		}
	};

	// override it for ace editors
	private getSelectionStart = (): number => {
		return this.sourceEditor.getSelectionStart();
	};

	private getSelectionEnd = (): number => {
		return this.sourceEditor.getSelectionEnd();
	};

	private getMirrorValue(): string {
		return this.sourceEditor.getValue();
	}

	private setMirrorValue(value: string) {
		this.sourceEditor.setValue(value);
	}

	private setFocusToMirror() {
		this.sourceEditor.focus();
	}

	private saveSelection = () => {
		if (this.jodit.getRealMode() === consts.MODE_WYSIWYG) {
			this.selInfo = this.jodit.selection.save() || [];
			this.jodit.setEditorValue();
			this.fromWYSIWYG(true);

		} else {
			this.selInfo.length = 0;
			const value: string = this.getMirrorValue();
			if (this.getSelectionStart() === this.getSelectionEnd()) {
				const marker = this.jodit.selection.marker(true);

				this.selInfo[0] = {
					startId: marker.id,
					collapsed: true,
					startMarker: marker.outerHTML
				};

				const selectionStart = this.getNormalPosition(
					this.getSelectionStart(),
					this.getMirrorValue()
				);

				this.setMirrorValue(
					value.substr(0, selectionStart) +
						this.__clear(this.selInfo[0].startMarker) +
						value.substr(selectionStart)
				);
			} else {
				const markerStart: HTMLSpanElement = this.jodit.selection.marker(
					true
				);
				const markerEnd: HTMLSpanElement = this.jodit.selection.marker(
					false
				);

				this.selInfo[0] = {
					startId: markerStart.id,
					endId: markerEnd.id,
					collapsed: false,
					startMarker: this.__clear(markerStart.outerHTML),
					endMarker: this.__clear(markerEnd.outerHTML)
				};

				const selectionStart = this.getNormalPosition(
					this.getSelectionStart(),
					value
				);
				const selectionEnd = this.getNormalPosition(
					this.getSelectionEnd(),
					value
				);

				this.setMirrorValue(
					value.substr(0, selectionStart) +
						this.selInfo[0].startMarker +
						value.substr(
							selectionStart,
							selectionEnd - selectionStart
						) +
						this.selInfo[0].endMarker +
						value.substr(selectionEnd)
				);
			}

			this.toWYSIWYG();
		}
	};

	private restoreSelection = () => {
		if (!this.selInfo.length) {
			return;
		}

		if (this.jodit.getRealMode() === consts.MODE_WYSIWYG) {
			this.__lock = true;
			this.jodit.selection.restore(this.selInfo);
			this.__lock = false;
			return;
		}

		let value: string = this.getMirrorValue();
		let selectionStart: number = 0,
			selectionEnd: number = 0;
		try {
			if (this.selInfo[0].startMarker) {
				value = value.replace(
					/<span[^>]+data-jodit_selection_marker="start"[^>]*>[<>]*?<\/span>/gim,
					this.tempMarkerStart
				);
			}

			if (this.selInfo[0].endMarker) {
				value = value.replace(
					/<span[^>]+data-jodit_selection_marker="end"[^>]*>[<>]*?<\/span>/gim,
					this.tempMarkerEnd
				);
			}

			if (this.jodit.options.beautifyHTML) {
				const html = this.jodit.events.fire('beautifyHTML', value);
				if (isString(html)) {
					value = html;
				}
			}

			selectionStart = value.indexOf(this.tempMarkerStart);
			selectionEnd = selectionStart;

			value = value.replace(this.tempMarkerStartReg, '');

			if (!this.selInfo[0].collapsed || selectionStart === -1) {
				selectionEnd = value.indexOf(this.tempMarkerEnd);
				if (selectionStart === -1) {
					selectionStart = selectionEnd;
				}
			}

			value = value.replace(this.tempMarkerEndReg, '');
		} finally {
			value = value
				.replace(this.tempMarkerEndReg, '')
				.replace(this.tempMarkerStartReg, '');
		}

		this.setMirrorValue(value);

		this.setMirrorSelectionRange(selectionStart, selectionEnd);

		this.toWYSIWYG();

		this.setFocusToMirror(); // need for setting focus after change mode
	};

	setMirrorSelectionRange: (start: number, end: number) => void = (
		start: number,
		end: number
	) => {
		this.sourceEditor.setSelectionRange(start, end);
	};

	private onReadonlyReact = () => {
		this.sourceEditor.setReadOnly(this.jodit.options.readonly);
	};

	private initSourceEditor(editor: IJodit) {
		if (editor.options.sourceEditor !== 'area') {
			const sourceEditor = createSourceEditor(editor.options.sourceEditor, editor, this.mirrorContainer, this.toWYSIWYG, this.fromWYSIWYG);

			sourceEditor.onReadyAlways(() => {
				this.sourceEditor?.destruct();
				this.sourceEditor = sourceEditor;
				editor.events?.fire('sourceEditorReady', editor);
			});

		} else {
			this.sourceEditor.onReadyAlways(() => {
				editor.events?.fire('sourceEditorReady', editor);
			});
		}
	}

	afterInit(editor: IJodit): void {
		this.mirrorContainer = editor.create.div('jodit_source');
		editor.workplace.appendChild(this.mirrorContainer);

		editor.events.on('afterAddPlace changePlace afterInit', () => {
			editor.workplace.appendChild(this.mirrorContainer);
		});

		this.sourceEditor = createSourceEditor('area', editor, this.mirrorContainer, this.toWYSIWYG, this.fromWYSIWYG);

		const addListeners = () => {
			// save restore selection
			editor.events
				.off('beforeSetMode.source afterSetMode.source')
				.on('beforeSetMode.source', this.saveSelection)
				.on('afterSetMode.source', this.restoreSelection);
		};

		addListeners();
		this.onReadonlyReact();

		editor.events
			.on(
				'insertHTML.source',
				(html: string): void | false => {
					if (!editor.options.readonly && !this.jodit.isEditorMode()) {
						this.insertHTML(html);
						return false;
					}
				}
			)
			.on('readonly.source', this.onReadonlyReact)
			.on('placeholder.source', (text: string) => {
				this.sourceEditor.setPlaceHolder(text);
			})
			.on('beforeCommand.source', this.onSelectAll)
			.on('change.source', this.fromWYSIWYG);

		editor.events.on('beautifyHTML', (html) => html);

		if (editor.options.beautifyHTML) {
			const addEventListener = () => {
				const html_beautify = (editor.ownerWindow as any).html_beautify;

				if (html_beautify && !editor.isInDestruct) {
					editor.events
						?.off('beautifyHTML')
						?.on('beautifyHTML', (html) => html_beautify(html));

					return true;
				}

				return false;
			};

			if (!addEventListener()) {
				loadNext(
					editor,
					editor.options.beautifyHTMLCDNUrlsJS
				).then(addEventListener);
			}
		}

		this.fromWYSIWYG();

		this.initSourceEditor(editor);
	}

	beforeDestruct(jodit: IJodit): void {
		if (this.sourceEditor) {
			this.sourceEditor.destruct();
			delete this.sourceEditor;
		}

		Dom.safeRemove(this.mirrorContainer);
	}
}
