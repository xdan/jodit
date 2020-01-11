/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit, ISourceEditor } from '../../../types';
import { SourceEditor } from '../SourceEditor';

export class CustomEditor extends SourceEditor<HTMLTextAreaElement>
	implements ISourceEditor {

	init(editor: IJodit): any {
		this.onReady();
	}

	destruct(): any {}

	getValue(): string {
		return '';
	}

	setValue(raw: string): void {}

	insertRaw(raw: string): void {}

	getSelectionStart(): number {
		return 0;
	}

	getSelectionEnd(): number {
		return 0;
	}

	setSelectionRange(start: number, end: number): void {}

	focus(): void {}

	setPlaceHolder(title: string): void {}

	setReadOnly(isReadOnly: boolean): void {}

	selectAll(): void {}
}
