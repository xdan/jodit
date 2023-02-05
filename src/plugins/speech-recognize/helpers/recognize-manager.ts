/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech-recognize
 */

import { Eventify } from 'jodit/core/event-emitter/eventify';
import type { CanUndef, IAsync, IDestructible } from 'jodit/types';
import { autobind } from 'jodit/core/decorators';

import { sound } from './sound';
import { PII, WARN } from '../constants';
import type { ISpeechRecognize, ISpeechRecognizeResult } from '../interface';

@autobind
export class RecognizeManager
	extends Eventify<{
		pulse: (enable: boolean) => void;
		result: (text: string) => void;
		progress: (text: string) => void;
		error: () => void;
		sound: (type: number) => void;
	}>
	implements IDestructible
{
	private _lang: CanUndef<string>;
	set lang(v: CanUndef<string>) {
		this._lang = v;
		this._api.lang = v;
	}
	get lang(): CanUndef<string> {
		return this._lang;
	}

	private _continuous: boolean = false;
	set continuous(v: boolean) {
		this._continuous = v;
		this._api.continuous = v;
	}
	get continuous(): boolean {
		return this._continuous;
	}

	private _interimResults: boolean = false;
	set interimResults(v: boolean) {
		this._interimResults = v;
		this._api.interimResults = v;
	}
	get interimResults(): boolean {
		return this._interimResults;
	}

	sound: boolean = true;

	constructor(private async: IAsync, api: ISpeechRecognize) {
		super();
		this._api = api;
		RecognizeManager._instances.add(this);
	}

	private static _instances: Set<RecognizeManager> = new Set();

	override destruct(): void {
		this.stop();
		RecognizeManager._instances.delete(this);
		super.destruct();
	}

	private _isEnabled: boolean = false;
	get isEnabled(): boolean {
		return this._isEnabled;
	}

	start(): void {
		if (this._isEnabled) {
			return;
		}

		this._isEnabled = true;

		RecognizeManager._instances.forEach(instance => {
			if (instance !== this) {
				instance.stop();
			}
		});

		this._api.start();
		this.__on('speechstart', this._onSpeechStart)
			.__on('error', this._onError)
			.__on('result', this._onResult);
	}

	stop(): void {
		if (!this._isEnabled) {
			return;
		}

		try {
			this._api.abort();
			this._api.stop();
		} catch {}

		this.__off('speechstart', this._onSpeechStart)
			.__off('error', this._onError)
			.__off('result', this._onResult);

		this.async.clearTimeout(this._restartTimeout);

		this._isEnabled = false;
		this.emit('pulse', false);
	}

	toggle(): void {
		if (!this._isEnabled) {
			this.start();
		} else {
			this.stop();
		}
	}

	restart(): void {
		this.stop();
		this.start();
	}

	private _restartTimeout: number = 0;

	private _onSpeechStart = (e: any): void => {
		if (!this._isEnabled) {
			return;
		}

		this.async.clearTimeout(this._restartTimeout);
		this._restartTimeout = this.async.setTimeout(() => {
			this.restart();
			this.emit('pulse', false);
			this._makeSound(WARN);
		}, 5000);

		this.emit('pulse', true);
	};

	private readonly _api: ISpeechRecognize;

	private __on(event: string, callback: Function): this {
		this._api.addEventListener(event, callback);
		return this;
	}

	private __off(event: string, callback: Function): this {
		this._api.removeEventListener(event, callback);
		return this;
	}

	private _progressTimeout: number = 0;
	private _onResult(e: ISpeechRecognizeResult): void {
		if (!this._isEnabled) {
			return;
		}

		this.async.clearTimeout(this._progressTimeout);

		const resultItem = e.results.item(e.resultIndex);
		const { transcript } = resultItem.item(0);

		const resultHandler = (): void => {
			try {
				this.async.clearTimeout(this._restartTimeout);
				this.emit('result', transcript);
			} catch {}

			this.restart();

			this.emit('pulse', false);
			this._makeSound(PII);
		};

		if (resultItem.isFinal === false) {
			this.emit('progress', transcript);
			this._progressTimeout = this.async.setTimeout(resultHandler, 500);
			return;
		}

		resultHandler();
	}

	private _onError(): void {
		if (!this._isEnabled) {
			return;
		}

		this._makeSound(WARN);
		this.emit('pulse', false);
		this.restart();
	}

	private _makeSound(frequency: number): void {
		if (this.sound) {
			sound({ frequency });
		}
	}
}
