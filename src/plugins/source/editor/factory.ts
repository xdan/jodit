/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { AceEditor, TextAreaEditor } from './engines';
import { CallbackFunction, IJodit, ISourceEditor } from '../../../types';

export function createSourceEditor (
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
