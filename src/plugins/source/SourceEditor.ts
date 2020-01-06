import { CallbackFunction, IJodit } from '../../types';

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

	protected onReady() {
		this.jodit.events.fire(this, 'ready');
	}

	static make(
		type: 'ace' | 'mirror' | 'area',
		editor: IJodit,
		container: HTMLElement,
		toWYSIWYG: CallbackFunction,
		fromWYSIWYG: CallbackFunction
	) {
		let sourceEditor;

		switch (type) {
			case 'ace':
				sourceEditor = new AceEditor(editor, container, toWYSIWYG, fromWYSIWYG);
				break;

			default:
				sourceEditor = new TextAreaEditor(editor, container, toWYSIWYG, fromWYSIWYG);
		}

		sourceEditor.init(editor);

		return sourceEditor;
	}
}

import { AceEditor, TextAreaEditor } from './editors';
