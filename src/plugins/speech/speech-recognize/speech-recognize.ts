/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/speech/speech-recognize/README.md]]
 * @packageDocumentation
 * @module plugins/speech/speech-recognize
 */

import type { IJodit, IPlugin } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { SpeechRecognition } from './helpers/microphone-input';

import './config';

export class SpeechRecognizeNative extends Plugin implements IPlugin {
	override buttons: Plugin['buttons'] = SpeechRecognition
		? [
				{
					group: 'state',
					name: 'speechRecognize'
				}
		  ]
		: [];

	protected override afterInit(jodit: IJodit): void {}

	protected override beforeDestruct(jodit: IJodit): void {}
}

declare const Jodit: {
	plugins: any;
};

Jodit.plugins.add('speech-recognize', SpeechRecognizeNative);
