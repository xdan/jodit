/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech/speech-recognize
 */

export interface ISpeechRecognizeResult {
	results: Array<
		Array<{
			transcript: string;
		}>
	>;
}

export interface ISpeechRecognize {
	addEventListener(
		event: 'result',
		e: (result: ISpeechRecognizeResult) => void
	): void;
	addEventListener(event: string, e: Function): void;
	removeEventListener(event: string, e: Function): void;
	lang: string;

	start(): void;
	abort(): void;
	stop(): void;
}

export interface ISpeechRecognizeConstructor {
	new (): ISpeechRecognize;
}
