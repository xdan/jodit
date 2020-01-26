/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit, ISourceEditor } from '../../../../types';
import { css } from '../../../../modules/helpers';
import { Dom } from '../../../../modules';
import { SourceEditor } from '../SourceEditor';

export class TextAreaEditor extends SourceEditor<HTMLTextAreaElement>
	implements ISourceEditor {
	private autosize = this.jodit.async.debounce(() => {
		this.instance.style.height = 'auto';
		this.instance.style.height = this.instance.scrollHeight + 'px';
	}, this.jodit.defaultTimeout);

	init(editor: IJodit): any {
		this.instance = editor.create.element('textarea', {
			class: 'jodit_source_mirror'
		});

		this.container.appendChild(this.instance);

		editor.events
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
				editor.events.fire(e.type, e);
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

	setSelectionRange(start: number, end: number): void {
		this.instance.setSelectionRange(start, end);
	}

	focus(): void {
		this.instance.focus();
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
}
