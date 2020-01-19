/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
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
