/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { CallbackFunction, IJodit, ISourceEditor } from '../../types';

export abstract class SourceEditor<T> {
	instance: T;
	className: string = '';

	protected constructor(
		readonly jodit: IJodit,
		readonly container: HTMLElement,
		readonly toWYSIWYG: CallbackFunction,
		readonly fromWYSIWYG: CallbackFunction
	) {}

	abstract init(editor: IJodit): void;

	isReady: boolean = false;
	protected onReady() {
		this.isReady = true;
		this.jodit.events.fire(this, 'ready');
	}

	onReadyAlways(onReady: CallbackFunction) {
		if (!this.isReady) {
			this.jodit.events?.on(this, 'ready', onReady);
		} else {
			onReady();
		}
	}

	static make(
		type: 'ace' | 'mirror' | 'area',
		editor: IJodit,
		container: HTMLElement,
		toWYSIWYG: CallbackFunction,
		fromWYSIWYG: CallbackFunction
	) {
		let sourceEditor: ISourceEditor;

		switch (type) {
			case 'ace':
				sourceEditor = new AceEditor(editor, container, toWYSIWYG, fromWYSIWYG);
				break;

			default:
				sourceEditor = new TextAreaEditor(editor, container, toWYSIWYG, fromWYSIWYG);
		}

		sourceEditor.init(editor);
		sourceEditor.onReadyAlways(() => {
			sourceEditor.setReadOnly(editor.options.readonly);
		});



		return sourceEditor;
	}
}

import { AceEditor, TextAreaEditor } from './editors';
