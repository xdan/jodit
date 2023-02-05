/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/source
 */

import type { CallbackFunction, IJodit, ISourceEditor } from 'jodit/types';
import { isFunction } from 'jodit/core/helpers';

import { AceEditor, TextAreaEditor } from './engines';

export function createSourceEditor(
	type: 'ace' | 'mirror' | 'area' | ((jodit: IJodit) => ISourceEditor),
	editor: IJodit,
	container: HTMLElement,
	toWYSIWYG: CallbackFunction,
	fromWYSIWYG: CallbackFunction
): ISourceEditor {
	let sourceEditor: ISourceEditor;

	if (isFunction(type)) {
		sourceEditor = type(editor);
	} else {
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
	}

	sourceEditor.init(editor);
	sourceEditor.onReadyAlways(() => {
		sourceEditor.setReadOnly(editor.o.readonly);
	});

	return sourceEditor;
}
