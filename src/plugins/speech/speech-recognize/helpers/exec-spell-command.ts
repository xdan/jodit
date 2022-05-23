/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech/speech-recognize
 */

import type { IJodit } from 'jodit/types';
import { NEWLINE, DELETE } from './commands';

export function execSpellCommand(jodit: IJodit, command: string): void {
	switch (command) {
		case DELETE: {
			jodit.execCommand('backspaceWordButton');
			break;
		}

		case NEWLINE: {
			jodit.execCommand('enter', '', {});
			break;
		}
	}
}
