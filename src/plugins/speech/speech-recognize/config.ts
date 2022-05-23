/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech/speech-recognize
 */

import type { IControlType, IJodit, IDictionary } from 'jodit/types';
import type { ISpeechRecognizeConstructor } from './interface';
import { Config } from 'jodit/config';
import { RecognizeManager } from './helpers/recognize-manager';
import { Alert } from 'jodit/modules/dialog/alert';
import { SpeechRecognition } from './helpers/api';
import { Sound } from './helpers/sound';
import { dataBind } from '../../../core/helpers';
import { NEWLINE, DELETE } from './helpers/commands';

declare module 'jodit/config' {
	interface Config {
		speechRecognize: {
			api: ISpeechRecognizeConstructor;

			lang: string;

			/**
			 * On recognition error - make an error sound
			 */
			makeAlarmSounds: boolean;

			commands: IDictionary<string>;
		};
	}
}

Config.prototype.speechRecognize = {
	api: SpeechRecognition,
	lang: 'en-US',
	makeAlarmSounds: true,
	commands: {
		'newline|enter': NEWLINE,
		delete: DELETE
	}
};

Config.prototype.controls.speechRecognize = {
	isActive(jodit, _, btn): boolean {
		const api = btn && dataBind<RecognizeManager>(btn, 'speech');
		return Boolean(api?.isEnabled);
	},

	isDisabled(jodit: IJodit): boolean {
		return !jodit.o.speechRecognize.api;
	},

	exec(jodit: IJodit, current, { button }): void {
		const { api: Api, lang } = jodit.o.speechRecognize;

		if (!Api) {
			Alert('Speech recognize API unsupported in your browser');
			return;
		}

		let api = dataBind<RecognizeManager>(button, 'speech');

		if (!api) {
			api = new RecognizeManager(jodit.async, new Api());
			api.lang = lang;
			dataBind<RecognizeManager>(button, 'speech', api);

			api.on('pulse', (enable: boolean) => {
				button.setMod('pulse', enable);
			});

			api.on('result', (text: string): void =>
				jodit.e.fire('speechRecognizeResult', text)
			);

			if (jodit.o.speechRecognize.makeAlarmSounds) {
				api.on('sound', (sound: number) => {
					Sound({ sound });
				});
			}

			button.hookStatus('beforeDestruct', () => {
				api.destruct();
			});
		}

		api.toggle();
		button.state.activated = api.isEnabled;
	},
	icon: require('./icon.svg'),
	name: 'speechRecognize',
	command: 'toggleSpeechRecognize',
	tooltip: 'Speech Recognize',
	mods: {
		stroke: false
	}
} as IControlType;
