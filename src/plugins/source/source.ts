/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './source.less';

import type { IJodit, ISourceEditor } from '../../types';
import * as consts from '../../core/constants';
import { MODE_SOURCE } from '../../core/constants';
import { Plugin } from '../../core/plugin';
import { Dom } from '../../core/dom';
import { isString, loadNext } from '../../core/helpers';
import { createSourceEditor } from './editor/factory';
import { autobind, watch } from '../../core/decorators';

/**
 * Plug-in change simple textarea on CodeMirror editor in Source code mode
 *
 * @module source
 */
export class source extends Plugin {
	/** @override */
	buttons: Plugin['buttons'] = [
		{
			name: 'source',
			group: 'source'
		}
	];

	sourceEditor?: ISourceEditor;

	private mirrorContainer!: HTMLDivElement;

	private __lock = false;
	private __oldMirrorValue = '';

	private tempMarkerStart = '{start-jodit-selection}';
	private tempMarkerStartReg = /{start-jodit-selection}/g;
	private tempMarkerEnd = '{end-jodit-selection}';
	private tempMarkerEndReg = /{end-jodit-selection}/g;

	@watch(':insertHTML.source')
	protected onInsertHTML(html: string): void | false {
		if (!this.j.o.readonly && !this.j.isEditorMode()) {
			this.sourceEditor?.insertRaw(html);
			this.toWYSIWYG();
			return false;
		}
	}

	/**
	 * Update source editor from WYSIWYG area
	 * @param force
	 */
	@autobind
	private fromWYSIWYG(force: boolean | string = false): void {
		if (!this.__lock || force === true) {
			this.__lock = true;
			const new_value = this.j.getEditorValue(false);

			if (new_value !== this.getMirrorValue()) {
				this.setMirrorValue(new_value);
			}

			this.__lock = false;
		}
	}

	/**
	 * Update WYSIWYG area from source editor
	 */
	@autobind
	private toWYSIWYG(): void {
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
	}

	@autobind
	private getNormalPosition(pos: number, str: string): number {
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
	}

	private clnInv(str: string): string {
		return str.replace(consts.INVISIBLE_SPACE_REG_EXP(), '');
	}

	@watch(':beforeCommand.source')
	protected onSelectAll(command: string): void | false {
		if (
			command.toLowerCase() === 'selectall' &&
			this.j.getRealMode() === MODE_SOURCE
		) {
			this.sourceEditor?.selectAll();
			return false;
		}
	}

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

	@watch(':beforeSetMode.source')
	protected saveSelection(): void {
		if (this.j.getRealMode() === consts.MODE_WYSIWYG) {
			this.j.s.save();
			this.j.setEditorValue();
			this.fromWYSIWYG(true);
		} else {
			if (this.j.o.editHTMLDocumentMode) {
				return;
			}

			const value: string = this.getMirrorValue();

			if (this.getSelectionStart() === this.getSelectionEnd()) {
				const marker = this.j.s.marker(true);

				const selectionStart = this.getNormalPosition(
					this.getSelectionStart(),
					this.getMirrorValue()
				);

				this.setMirrorValue(
					value.substr(0, selectionStart) +
						this.clnInv(marker.outerHTML) +
						value.substr(selectionStart)
				);
			} else {
				const markerStart = this.j.s.marker(true);
				const markerEnd = this.j.s.marker(false);

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
						this.clnInv(markerStart.outerHTML) +
						value.substr(
							selectionStart,
							selectionEnd - selectionStart
						) +
						this.clnInv(markerEnd.outerHTML) +
						value.substr(selectionEnd)
				);
			}

			this.toWYSIWYG();
		}
	}

	@watch(':afterSetMode.source')
	protected removeSelection(): void {
		if (this.j.getRealMode() === consts.MODE_WYSIWYG) {
			this.__lock = true;
			this.j.s.restore();
			this.__lock = false;
			return;
		}

		let value: string = this.getMirrorValue();
		let selectionStart: number = 0,
			selectionEnd: number = 0;

		try {
			value = value
				.replace(
					/<span[^>]+data-jodit-selection_marker=(["'])start\1[^>]*>[<>]*?<\/span>/gim,
					this.tempMarkerStart
				)
				.replace(
					/<span[^>]+data-jodit-selection_marker=(["'])end\1[^>]*>[<>]*?<\/span>/gim,
					this.tempMarkerEnd
				);

			if (!this.j.o.editHTMLDocumentMode && this.j.o.beautifyHTML) {
				const html = this.j.e.fire('beautifyHTML', value);

				if (isString(html)) {
					value = html;
				}
			}

			selectionStart = value.indexOf(this.tempMarkerStart);
			selectionEnd = selectionStart;

			value = value.replace(this.tempMarkerStartReg, '');

			if (selectionStart !== -1) {
				const selectionEndCursor = value.indexOf(this.tempMarkerEnd);

				if (selectionEndCursor !== -1) {
					selectionEnd = selectionEndCursor;
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
	}

	@autobind
	private setMirrorSelectionRange(start: number, end: number): void {
		this.sourceEditor?.setSelectionRange(start, end);
	}

	@watch(':readonly.source')
	private onReadonlyReact(): void {
		this.sourceEditor?.setReadOnly(this.j.o.readonly);
	}

	/** @override */
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

		this.onReadonlyReact();

		editor.e
			.on('placeholder.source', (text: string) => {
				this.sourceEditor?.setPlaceHolder(text);
			})
			.on('change.source', this.fromWYSIWYG)
			.on('beautifyHTML', html => html);

		if (editor.o.beautifyHTML) {
			const addEventListener = () => {
				const html_beautify = (editor.ow as any).html_beautify;

				if (html_beautify && !editor.isInDestruct) {
					editor.events
						?.off('beautifyHTML')
						.on('beautifyHTML', html => html_beautify(html));

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

	/** @override */
	beforeDestruct(jodit: IJodit): void {
		if (this.sourceEditor) {
			this.sourceEditor.destruct();
			delete this.sourceEditor;
		}

		Dom.safeRemove(this.mirrorContainer);
	}
}
