/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech-recognize
 */

import type { ISpeechRecognizeConstructor } from '../interface';

export const SpeechRecognition: ISpeechRecognizeConstructor =
	(window as any).SpeechRecognition ||
	(window as any).webkitSpeechRecognition;
