/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CallbackFunction, IJodit, ISourceEditor } from '../../../types';
import { AceEditor, TextAreaEditor } from './engines';

export function createSourceEditor(
	type: 'ace' | 'mirror' | 'area',
	editor: IJodit,
	container: HTMLElement,
	toWYSIWYG: CallbackFunction,
	fromWYSIWYG: CallbackFunction
): ISourceEditor {
	let sourceEditor: ISourceEditor;

	switch (type) {
		case 'ace':
			if (!editor.o.shadowRoot) {
				sourceEditor = new AceEditor(
					editor,
					container,
					toWYSIWYG,
					fromWYSIWYG
				);
				break;
			}

		default:
			sourceEditor = new TextAreaEditor(
				editor,
				container,
				toWYSIWYG,
				fromWYSIWYG
			);
	}

	sourceEditor.init(editor);
	sourceEditor.onReadyAlways(() => {
		sourceEditor.setReadOnly(editor.o.readonly);
	});

	return sourceEditor;
}
