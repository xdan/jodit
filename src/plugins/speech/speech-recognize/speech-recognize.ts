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

import './speech-recognize.less';

import type { IDictionary, IJodit, IPlugin } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { watch } from 'jodit/src/core/decorators/watch/watch';
import { keys } from 'jodit/src/core/helpers/utils/utils';

import './config';

export class SpeechRecognizeNative extends Plugin implements IPlugin {
	override buttons: Plugin['buttons'] = [
		{
			group: 'state',
			name: 'speechRecognize'
		}
	];

	protected override afterInit(jodit: IJodit): void {
		if (jodit.o.speechRecognize.commands) {
			keys(jodit.o.speechRecognize.commands, false).forEach(words => {
				const keys = words.split('|');
				keys.forEach(key => {
					key = key.toLowerCase();
					this._commandToWord[key] =
						jodit.o.speechRecognize.commands[words];

					const translatedKey = jodit.i18n(key).toLowerCase();
					if (translatedKey !== key) {
						jodit.o.speechRecognize.commands[words];
					}
				});
			});
		}
	}

	protected override beforeDestruct(jodit: IJodit): void {}

	@watch(':speechRecognizeResult')
	protected onSpeechRecognizeResult(text: string): void {
		if (!this._checkCommand(text)) {
			this.j.s.insertHTML(text);
		}
	}

	private _checkCommand(command: string): boolean {
		command = command.toLowerCase();

		if (this._commandToWord[command]) {
			alert(this._commandToWord[command]);
			return true;
		}

		return false;
	}

	private _commandToWord: IDictionary<string> = {};
}

declare const Jodit: {
	plugins: any;
};

Jodit.plugins.add('speech-recognize', SpeechRecognizeNative);
