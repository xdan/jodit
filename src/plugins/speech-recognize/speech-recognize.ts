/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/speech-recognize/README.md]]
 * @packageDocumentation
 * @module plugins/speech-recognize
 */

import './speech-recognize.less';

import type { IDictionary, IJodit, IPlugin } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { watch } from 'jodit/core/decorators/watch/watch';
import { keys } from 'jodit/core/helpers/utils/utils';
import { extendLang } from 'jodit/core/global';
import { Dom } from 'jodit/core/dom/dom';
import { debounce } from 'jodit/core/decorators/debounce/debounce';

import { execSpellCommand } from './helpers/exec-spell-command';
import './config';

export class SpeechRecognizeNative extends Plugin implements IPlugin {
	constructor(j: IJodit) {
		super(j);

		if (j.o.speechRecognize.api) {
			j.registerButton({
				group: 'state',
				name: 'speechRecognize'
			});
		}
	}

	protected override afterInit(jodit: IJodit): void {
		const { commands } = jodit.o.speechRecognize;

		if (commands) {
			extendLang(require('./langs'));

			keys(commands, false).forEach(words => {
				const keys = words.split('|');

				keys.forEach(key => {
					key = key.trim().toLowerCase();
					this._commandToWord[key] = commands[words];

					const translatedKeys = jodit.i18n(key);

					if (translatedKeys !== key) {
						translatedKeys.split('|').forEach(translatedKey => {
							this._commandToWord[
								translatedKey.trim().toLowerCase()
							] = commands[words].trim();
						});
					}
				});
			});
		}
	}

	protected override beforeDestruct(jodit: IJodit): void {}

	private messagePopup!: HTMLElement;

	@watch(':speechRecognizeProgressResult')
	@debounce()
	protected onSpeechRecognizeProgressResult(text: string): void {
		if (!this.messagePopup) {
			this.messagePopup = this.j.create.div(
				'jodit-speech-recognize__popup'
			);
		}

		this.j.workplace.appendChild(this.messagePopup);
		this.j.async.setTimeout(
			() => {
				Dom.safeRemove(this.messagePopup);
			},
			{
				label: 'onSpeechRecognizeProgressResult',
				timeout: 1000
			}
		);

		this.messagePopup.innerText = text + '|';
	}

	@watch(':speechRecognizeResult')
	protected onSpeechRecognizeResult(text: string): void {
		const { j } = this,
			{ s } = j;

		Dom.safeRemove(this.messagePopup);

		if (!this._checkCommand(text)) {
			const { range } = s,
				node = s.current();

			if (
				s.isCollapsed() &&
				Dom.isText(node) &&
				Dom.isOrContains(j.editor, node) &&
				node.nodeValue
			) {
				const sentence = node.nodeValue;

				node.nodeValue =
					sentence +
					(/[\u00A0 ]\uFEFF*$/.test(sentence) ? '' : ' ') +
					text;

				range.setStartAfter(node);
				s.selectRange(range);
				j.synchronizeValues();
			} else {
				s.insertHTML(text);
			}
		}
	}

	private _checkCommand(command: string): boolean {
		command = command.toLowerCase().replace(/\./g, '');

		if (this._commandToWord[command]) {
			execSpellCommand(this.j, this._commandToWord[command]);
			return true;
		}

		return false;
	}

	private _commandToWord: IDictionary<string> = {};
}

declare const Jodit: {
	plugins: any;
};

if (typeof Jodit !== 'undefined') {
	Jodit.plugins.add('speech-recognize', SpeechRecognizeNative);
}
