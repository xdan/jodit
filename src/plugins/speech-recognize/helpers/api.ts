/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech-recognize
 */

import type { ISpeechRecognizeConstructor } from 'jodit/plugins/speech-recognize/interface';
import { globalWindow } from 'jodit/core/constants';

export const SpeechRecognition: ISpeechRecognizeConstructor | undefined =
	globalWindow
		? (globalWindow as any).SpeechRecognition ||
			(globalWindow as any).webkitSpeechRecognition
		: undefined;
