/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech-recognize
 */

import type { IControlType, IJodit, IDictionary } from 'jodit/types';

import { Config } from 'jodit/config';
import { dataBind } from 'jodit/core/helpers/utils/data-bind';
import { isBoolean } from 'jodit/core/helpers/checker/is-boolean';
import { Icon } from 'jodit/core/ui/icon';

import type { ISpeechRecognizeConstructor } from './interface';
import { RecognizeManager } from './helpers/recognize-manager';
import { SpeechRecognition } from './helpers/api';

declare module 'jodit/config' {
	interface Config {
		speechRecognize: {
			readonly api: ISpeechRecognizeConstructor;

			/**
			 * Returns and sets the language of the current SpeechRecognition.
			 * If not specified, this defaults to the HTML lang attribute value, or
			 * the user agent's language setting if that isn't set either.
			 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/lang
			 */
			readonly lang?: string;

			/**
			 * Controls whether continuous results are returned for each recognition,
			 * or only a single result.
			 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/continuous
			 */
			readonly continuous: boolean;

			/**
			 * Controls whether interim results should be returned (true) or not (false.)
			 * Interim results are results that are not yet final (e.g. the isFinal property is false.)
			 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/interimResults
			 */
			readonly interimResults: boolean;

			/**
			 * On recognition error - make an error sound
			 */
			readonly sound: boolean;

			/**
			 * You can specify any commands in your language by listing them with the `|` sign.
			 * In the value, write down any commands for
			 * [execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#parameters)
			 * and value (separated by ::)
			 * You can also use [custom Jodit commands](#need-article)
			 * For example
			 * ```js
			 * Jodit.make('#editor', {
			 *   speechRecognize: {
			 *     commands: {
			 *       'remove line|remove paragraph': 'backspaceSentenceButton',
			 *       'start bold': 'bold',
			 *       'insert table|create table': 'insertHTML::<table><tr><td>test</td></tr></table>',
			 *     }
			 *   }
			 * });
			 * ```
			 */
			readonly commands: IDictionary<string>;
		};
	}
}

Config.prototype.speechRecognize = {
	api: SpeechRecognition,
	sound: true,
	continuous: true,
	interimResults: true,
	commands: {
		'newline|enter': 'enter',
		'delete|remove word|delete word': 'backspaceWordButton',
		comma: 'inserthtml::,',
		underline: 'inserthtml::_',
		hyphen: 'inserthtml::-',
		space: 'inserthtml:: ',
		question: 'inserthtml::?',
		dot: 'inserthtml::.',
		'quote|quotes|open quote': "inserthtml::'",
		'header|header h1': 'formatblock::h1',
		'select all': 'selectall'
	}
};

Icon.set('speech-recognize', require('./speech-recognize.svg'));

Config.prototype.controls.speechRecognize = {
	isActive(jodit, _): boolean {
		const api = dataBind<RecognizeManager>(jodit, 'speech');
		return Boolean(api?.isEnabled);
	},

	isDisabled(jodit: IJodit): boolean {
		return !jodit.o.speechRecognize.api;
	},

	exec(jodit: IJodit, current, { button, control }): void {
		const {
			api: Api,
			lang,
			continuous,
			interimResults,
			sound
		} = jodit.o.speechRecognize;

		if (!Api) {
			jodit.alert('Speech recognize API unsupported in your browser');
			return;
		}

		let api = dataBind<RecognizeManager>(jodit, 'speech');

		if (!api) {
			const nativeApi = new Api();
			api = new RecognizeManager(jodit.async, nativeApi);

			api.lang = lang;
			api.continuous = continuous;
			api.interimResults = interimResults;
			api.sound = sound;

			dataBind<RecognizeManager>(jodit, 'speech', api);

			api.on('pulse', (enable: boolean) => {
				button.setMod('pulse', enable);
			});

			api.on('result', (text: string): void =>
				jodit.e.fire('speechRecognizeResult', text)
			);

			api.on('progress', (text: string): void =>
				jodit.e.fire('speechRecognizeProgressResult', text)
			);

			button.hookStatus('beforeDestruct', () => {
				api.destruct();
			});
		}

		if (control.args) {
			const key = control.args[0] as
				| 'sound'
				| 'continuous'
				| 'interimResults';

			if (isBoolean(api[key])) {
				api[key] = !api[key];
				if (api.isEnabled) {
					api.restart();
				}
				return;
			}
		}

		api.toggle();
		button.state.activated = api.isEnabled;
	},

	name: 'speechRecognize',
	command: 'toggleSpeechRecognize',
	tooltip: 'Speech Recognize',

	list: {
		sound: 'Sound',
		interimResults: 'Interim Results'
	},

	childTemplate(
		jodit: IJodit,
		key: 'sound' | 'interimResults',
		value: string
	): string {
		const api = dataBind<RecognizeManager>(jodit, 'speech'),
			checked = api?.[key] ?? jodit.o.speechRecognize[key];

		return `<span class='jodit-speech-recognize__list-item'><input ${
			checked ? 'checked' : ''
		} class='jodit-checkbox' type='checkbox'>&nbsp;${value}</span>`;
	},
	mods: {
		stroke: false
	}
} as IControlType;
