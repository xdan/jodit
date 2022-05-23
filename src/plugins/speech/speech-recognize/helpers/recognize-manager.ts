/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech/speech-recognize
 */

import { Eventify } from 'jodit/src/core/event-emitter/eventify';
import type { IAsync, IDestructible } from 'jodit/src/types';
import type { ISpeechRecognize, ISpeechRecognizeResult } from '../interface';
import { PII, WARN } from '../../constants';
import { spy } from 'jodit/core/decorators/spy/spy';
import { autobind } from 'jodit/src/core/decorators';

@autobind
@spy
export class RecognizeManager
	extends Eventify<{
		pulse: (enable: boolean) => void;
		result: (text: string) => void;
		error: () => void;
		sound: (type: number) => void;
	}>
	implements IDestructible
{
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

	get lang(): string {
		return this._lang;
	}

	set lang(lang: string) {
		this._lang = lang;
		this._api.lang = lang;
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

			this.emit('sound', WARN);
			// Sound({ sound: WARN });
		}, 5000);

		this.emit('pulse', true);
	};

	private readonly _api: ISpeechRecognize;

	private _lang: string = 'en-EN';

	private __on(event: string, callback: Function): this {
		this._api.addEventListener(event, callback);
		return this;
	}

	private __off(event: string, callback: Function): this {
		this._api.removeEventListener(event, callback);
		return this;
	}

	private _onResult(e: ISpeechRecognizeResult): void {
		if (!this._isEnabled) {
			return;
		}

		try {
			this.async.clearTimeout(this._restartTimeout);
			this.emit('result', e.results[0][0].transcript);
		} catch {}

		this.restart();

		this.emit('pulse', false);
		this.emit('sound', PII);
	}

	private _onError(): void {
		if (!this._isEnabled) {
			return;
		}

		this.emit('sound', WARN);
		this.emit('pulse', false);
		this.restart();
	}
}
