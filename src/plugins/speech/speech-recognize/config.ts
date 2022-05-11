/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech/speech-recognize
 */

import type { IControlType } from 'jodit/types';
import { Config } from 'jodit/config';
import { SpeechRecognition } from './helpers/microphone-input';

Config.prototype.controls.speechRecognize = {
	isDisabled(): boolean {
		return !SpeechRecognition;
	},
	icon: require('./icon.svg'),
	name: 'speechRecognize',
	command: 'toggleSpeechRecognize',
	tooltip: 'Speech Recognize'
} as IControlType;
