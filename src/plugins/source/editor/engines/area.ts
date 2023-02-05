/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/source
 */

import type { IJodit, ISourceEditor } from 'jodit/types';
import { css } from 'jodit/core/helpers/utils/css';
import { Dom } from 'jodit/core/dom/dom';

import { SourceEditor } from '../sourceEditor';

export class TextAreaEditor
	extends SourceEditor<HTMLTextAreaElement>
	implements ISourceEditor
{
	private autosize = this.j.async.debounce(() => {
		this.instance.style.height = 'auto';
		this.instance.style.height = this.instance.scrollHeight + 'px';
	}, this.j.defaultTimeout);

	init(editor: IJodit): any {
		this.instance = editor.c.element('textarea', {
			class: 'jodit-source__mirror'
		});

		this.container.appendChild(this.instance);

		editor.e
			.on(
				this.instance,
				'mousedown keydown touchstart input',
				editor.async.debounce(this.toWYSIWYG, editor.defaultTimeout)
			)
			.on('setMinHeight.source', (minHeightD: number) => {
				css(this.instance, 'minHeight', minHeightD);
			})
			.on(
				this.instance,
				'change keydown mousedown touchstart input',
				this.autosize
			)
			.on('afterSetMode.source', this.autosize)
			.on(this.instance, 'mousedown focus', (e: Event) => {
				editor.e.fire(e.type, e);
			});

		this.autosize();

		this.onReady();
	}

	destruct(): any {
		Dom.safeRemove(this.instance);
	}

	getValue(): string {
		return this.instance.value;
	}

	setValue(raw: string): void {
		this.instance.value = raw;
	}

	insertRaw(raw: string): void {
		const value = this.getValue();

		if (this.getSelectionStart() >= 0) {
			const startPos = this.getSelectionStart(),
				endPos = this.getSelectionEnd();

			this.setValue(
				value.substring(0, startPos) +
					raw +
					value.substring(endPos, value.length)
			);
		} else {
			this.setValue(value + raw);
		}
	}

	getSelectionStart(): number {
		return this.instance.selectionStart;
	}

	getSelectionEnd(): number {
		return this.instance.selectionEnd;
	}

	setSelectionRange(start: number, end: number = start): void {
		this.instance.setSelectionRange(start, end);
	}

	get isFocused(): boolean {
		return this.instance === this.j.od.activeElement;
	}

	focus(): void {
		this.instance.focus();
	}

	blur(): void {
		this.instance.blur();
	}

	setPlaceHolder(title: string): void {
		this.instance.setAttribute('placeholder', title);
	}

	setReadOnly(isReadOnly: boolean): void {
		if (isReadOnly) {
			this.instance.setAttribute('readonly', 'true');
		} else {
			this.instance.removeAttribute('readonly');
		}
	}

	selectAll(): void {
		this.instance.select();
	}

	replaceUndoManager(): void {
		const { history } = this.jodit;

		this.j.e.on(
			this.instance,
			'keydown',
			(e: KeyboardEvent): false | void => {
				if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
					if (e.shiftKey) {
						history.redo();
					} else {
						history.undo();
					}

					this.setSelectionRange(this.getValue().length);

					return false;
				}
			}
		);
	}
}
