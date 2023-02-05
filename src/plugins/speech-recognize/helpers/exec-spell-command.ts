/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech-recognize
 */

import type { IJodit } from 'jodit/types';

export function execSpellCommand(jodit: IJodit, commandSentence: string): void {
	const [command, value] = commandSentence.split('::');
	jodit.execCommand(command, null, value);
}
