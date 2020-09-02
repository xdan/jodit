/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './source.less';

import * as consts from '../../core/constants';
import { MODE_SOURCE } from '../../core/constants';
import { Plugin } from '../../core/plugin';
import { IJodit, ISourceEditor, markerInfo } from '../../types';
import { Dom } from '../../core/dom';
import { isString, loadNext } from '../../core/helpers';
import { createSourceEditor } from './editor/factory';

/**
 * Plug-in change simple textarea on CodeMirror editor in Source code mode
 *
 * @module source
 */
export class source extends Plugin {
	sourceEditor?: ISourceEditor;

	private mirrorContainer!: HTMLDivElement;

	private __lock = false;
	private __oldMirrorValue = '';

	private tempMarkerStart = '{start-jodit-selection}';
	private tempMarkerStartReg = /{start-jodit-selection}/g;
	private tempMarkerEnd = '{end-jodit-selection}';
	private tempMarkerEndReg = /{end-jodit-selection}/g;

	private selInfo: markerInfo[] = [];

	private insertHTML = (html: string) => {
		this.sourceEditor?.insertRaw(html);

		this.toWYSIWYG();
	};

	private fromWYSIWYG = (force: boolean | string = false) => {
		if (!this.__lock || force === true) {
			this.__lock = true;
			const new_value = this.j.getEditorValue(false);

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
		this.j.setEditorValue(value);
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
				str[start + 1].match(/[\w/]+/i)
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
		str.replace(consts.INVISIBLE_SPACE_REG_EXP(), '');

	private selectAll = () => {
		this.sourceEditor?.selectAll();
	};

	private onSelectAll = (command: string): void | false => {
		if (
			command.toLowerCase() === 'selectall' &&
			this.j.getRealMode() === MODE_SOURCE
		) {
			this.selectAll();
			return false;
		}
	};

	// override it for ace editors
	private getSelectionStart = (): number => {
		return this.sourceEditor?.getSelectionStart() ?? 0;
	};

	private getSelectionEnd = (): number => {
		return this.sourceEditor?.getSelectionEnd() ?? 0;
	};

	private getMirrorValue(): string {
		return this.sourceEditor?.getValue() || '';
	}

	private setMirrorValue(value: string) {
		this.sourceEditor?.setValue(value);
	}

	private setFocusToMirror() {
		this.sourceEditor?.focus();
	}

	private saveSelection = (): void => {
		if (this.j.getRealMode() === consts.MODE_WYSIWYG) {
			this.selInfo = this.j.s.save() || [];
			this.j.setEditorValue();
			this.fromWYSIWYG(true);
		} else {
			this.selInfo.length = 0;

			if (this.j.o.editHTMLDocumentMode) {
				return;
			}

			const value: string = this.getMirrorValue();

			if (this.getSelectionStart() === this.getSelectionEnd()) {
				const marker = this.j.s.marker(true);

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
				const markerStart = this.j.s.marker(true);
				const markerEnd = this.j.s.marker(false);

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

	private removeSelection = () => {
		if (!this.selInfo.length) {
			return;
		}

		if (this.j.getRealMode() === consts.MODE_WYSIWYG) {
			this.__lock = true;
			this.j.s.restore(this.selInfo);
			this.__lock = false;
			return;
		}

		let value: string = this.getMirrorValue();
		let selectionStart: number = 0,
			selectionEnd: number = 0;
		try {
			if (this.selInfo[0].startMarker) {
				value = value.replace(
					/<span[^>]+data-jodit-selection_marker="start"[^>]*>[<>]*?<\/span>/gim,
					this.tempMarkerStart
				);
			}

			if (this.selInfo[0].endMarker) {
				value = value.replace(
					/<span[^>]+data-jodit-selection_marker="end"[^>]*>[<>]*?<\/span>/gim,
					this.tempMarkerEnd
				);
			}

			if (!this.j.o.editHTMLDocumentMode && this.j.o.beautifyHTML) {
				const html = this.j.e.fire('beautifyHTML', value);

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
		this.sourceEditor?.setSelectionRange(start, end);
	};

	private onReadonlyReact = () => {
		this.sourceEditor?.setReadOnly(this.j.o.readonly);
	};

	private initSourceEditor(editor: IJodit): void {
		if (editor.o.sourceEditor !== 'area') {
			const sourceEditor = createSourceEditor(
				editor.o.sourceEditor,
				editor,
				this.mirrorContainer,
				this.toWYSIWYG,
				this.fromWYSIWYG
			);

			sourceEditor.onReadyAlways(() => {
				this.sourceEditor?.destruct();
				this.sourceEditor = sourceEditor;
				this.fromWYSIWYG(true);
				editor.events?.fire('sourceEditorReady', editor);
			});
		} else {
			this.sourceEditor?.onReadyAlways(() => {
				this.fromWYSIWYG(true);
				editor.events?.fire('sourceEditorReady', editor);
			});
		}
	}

	afterInit(editor: IJodit): void {
		this.mirrorContainer = editor.c.div('jodit-source');
		editor.workplace.appendChild(this.mirrorContainer);

		editor.e.on('afterAddPlace changePlace afterInit', () => {
			editor.workplace.appendChild(this.mirrorContainer);
		});

		this.sourceEditor = createSourceEditor(
			'area',
			editor,
			this.mirrorContainer,
			this.toWYSIWYG,
			this.fromWYSIWYG
		);

		const addListeners = () => {
			// save restore selection
			editor.e
				.off('beforeSetMode.source afterSetMode.source')
				.on('beforeSetMode.source', this.saveSelection)
				.on('afterSetMode.source', this.removeSelection);
		};

		addListeners();
		this.onReadonlyReact();

		editor.e
			.on('insertHTML.source', (html: string): void | false => {
				if (!editor.o.readonly && !this.j.isEditorMode()) {
					this.insertHTML(html);
					return false;
				}
			})
			.on('readonly.source', this.onReadonlyReact)
			.on('placeholder.source', (text: string) => {
				this.sourceEditor?.setPlaceHolder(text);
			})
			.on('beforeCommand.source', this.onSelectAll)
			.on('change.source', this.fromWYSIWYG);

		editor.e.on('beautifyHTML', html => html);

		if (editor.o.beautifyHTML) {
			const addEventListener = () => {
				const html_beautify = (editor.ow as any).html_beautify;

				if (html_beautify && !editor.isInDestruct) {
					editor.events
						?.off('beautifyHTML')
						?.on('beautifyHTML', html => html_beautify(html));

					return true;
				}

				return false;
			};

			if (!addEventListener()) {
				loadNext(editor, editor.o.beautifyHTMLCDNUrlsJS).then(
					addEventListener
				);
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
