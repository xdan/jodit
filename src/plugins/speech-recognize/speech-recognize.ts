/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/speech-recognize/README.md]]
 * @packageDocumentation
 * @module plugins/speech-recognize
 */

import type { IDictionary, IJodit, IPlugin } from 'jodit/types';
import { watch } from 'jodit/core/decorators/watch/watch';
import { Dom } from 'jodit/core/dom/dom';
import { extendLang } from 'jodit/core/global';
import { keys } from 'jodit/core/helpers/utils/utils';
import { Plugin } from 'jodit/core/plugin';

import './config';

import { Jodit } from '../../jodit';

import { execSpellCommand } from './helpers/exec-spell-command';
import * as langs from './langs';

import './speech-recognize.less';

export class SpeechRecognizeNative extends Plugin implements IPlugin {
	override buttons = [
		{
			group: 'state',
			name: 'speechRecognize'
		}
	];

	protected override afterInit(jodit: IJodit): void {
		const { commands } = jodit.o.speechRecognize;

		if (commands) {
			extendLang(langs);

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

	protected override beforeDestruct(jodit: IJodit): void {
		Dom.safeRemove(this.messagePopup);
	}

	private messagePopup!: HTMLElement;
	private __hidePopupTimeout!: number;

	@watch(':speechRecognizeProgressResult')
	protected onSpeechRecognizeProgressResult(text: string): void {
		if (!this.messagePopup) {
			this.messagePopup = this.j.create.div(
				'jodit-speech-recognize__popup'
			);
		}

		this.j.workplace.appendChild(this.messagePopup);
		this.j.async.clearTimeout(this.__hidePopupTimeout);
		this.__hidePopupTimeout = this.j.async.setTimeout(() => {
			Dom.safeRemove(this.messagePopup);
		}, 1000);

		this.messagePopup.innerText = text + '|';
	}

	@watch(':speechRecognizeResult')
	protected onSpeechRecognizeResult(text: string): void {
		this.j.async.clearTimeout(this.__hidePopupTimeout);
		Dom.safeRemove(this.messagePopup);

		const { j } = this;
		const { s } = j;

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

Jodit.plugins.add('speech-recognize', SpeechRecognizeNative);
