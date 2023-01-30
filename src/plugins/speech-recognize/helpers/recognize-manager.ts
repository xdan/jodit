/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
	private __lang: CanUndef<string>;
	set lang(v: CanUndef<string>) {
		this.__lang = v;
		this.__api.lang = v;
	}
	get lang(): CanUndef<string> {
		return this.__lang;
	}

	private __continuous: boolean = false;
	set continuous(v: boolean) {
		this.__continuous = v;
		this.__api.continuous = v;
	}
	get continuous(): boolean {
		return this.__continuous;
	}

	private __interimResults: boolean = false;

	set interimResults(v: boolean) {
		this.__interimResults = v;
		this.__api.interimResults = v;
	}
	get interimResults(): boolean {
		return this.__interimResults;
	}

	sound: boolean = true;

	constructor(private __async: IAsync, api: ISpeechRecognize) {
		super();
		this.__api = api;
		RecognizeManager.__instances.add(this);
	}

	private static __instances: Set<RecognizeManager> = new Set();

	override destruct(): void {
		this.stop();
		RecognizeManager.__instances.delete(this);
		super.destruct();
	}

	private __isEnabled: boolean = false;
	get isEnabled(): boolean {
		return this.__isEnabled;
	}

	start(): void {
		if (this.__isEnabled) {
			return;
		}

		this.__isEnabled = true;

		RecognizeManager.__instances.forEach(instance => {
			if (instance !== this) {
				instance.stop();
			}
		});

		this.__api.start();
		this.__on('speechstart', this.__onSpeechStart)
			.__on('error', this.__onError)
			.__on('result', this.__onResult);
	}

	stop(): void {
		if (!this.__isEnabled) {
			return;
		}

		try {
			this.__api.abort();
			this.__api.stop();
		} catch {}

		this.__off('speechstart', this.__onSpeechStart)
			.__off('error', this.__onError)
			.__off('result', this.__onResult);

		this.__async.clearTimeout(this.__restartTimeout);

		this.__isEnabled = false;
		this.emit('pulse', false);
	}

	toggle(): void {
		if (!this.__isEnabled) {
			this.start();
		} else {
			this.stop();
		}
	}

	restart(): void {
		this.stop();
		this.start();
	}

	private __restartTimeout: number = 0;

	private __onSpeechStart = (e: any): void => {
		if (!this.__isEnabled) {
			return;
		}

		this.__async.clearTimeout(this.__restartTimeout);
		this.__restartTimeout = this.__async.setTimeout(() => {
			this.restart();
			this.emit('pulse', false);
			this.__makeSound(WARN);
		}, 5000);

		this.emit('pulse', true);
	};

	private readonly __api: ISpeechRecognize;

	private __on(event: string, callback: Function): this {
		this.__api.addEventListener(event, callback);
		return this;
	}

	private __off(event: string, callback: Function): this {
		this.__api.removeEventListener(event, callback);
		return this;
	}

	private __progressTimeout: number = 0;
	private __onResult(e: ISpeechRecognizeResult): void {
		if (!this.__isEnabled) {
			return;
		}

		this.__async.clearTimeout(this.__progressTimeout);

		const resultItem = e.results.item(e.resultIndex);
		const { transcript } = resultItem.item(0);

		const resultHandler = (): void => {
			try {
				this.__async.clearTimeout(this.__restartTimeout);
				this.emit('result', transcript);
			} catch {}

			this.restart();

			this.emit('pulse', false);
			this.__makeSound(PII);
		};

		if (resultItem.isFinal === false) {
			this.emit('progress', transcript);
			this.__progressTimeout = this.__async.setTimeout(
				resultHandler,
				500
			);
			return;
		}

		resultHandler();
	}

	private __onError(): void {
		if (!this.__isEnabled) {
			return;
		}

		this.__makeSound(WARN);
		this.emit('pulse', false);
		this.restart();
	}

	private __makeSound(frequency: number): void {
		if (this.sound) {
			sound({ frequency });
		}
	}
}
