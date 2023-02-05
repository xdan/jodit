/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech-recognize
 */

export interface ISpeechRecognizeResult {
	resultIndex: number;
	results: {
		item(index: number): {
			isFinal?: boolean;
			item(subIndex: number): { transcript: string };
		};
	};
}

export interface ISpeechRecognize {
	addEventListener(
		event: 'result',
		e: (result: ISpeechRecognizeResult) => void
	): void;
	addEventListener(event: string, e: Function): void;
	removeEventListener(event: string, e: Function): void;

	/**
	 * https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/lang
	 */
	lang?: string;

	/**
	 * https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/interimResults
	 */
	interimResults: boolean;

	/**
	 * https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/continuous
	 */
	continuous: boolean;

	start(): void;
	abort(): void;
	stop(): void;
}

export interface ISpeechRecognizeConstructor {
	new (): ISpeechRecognize;
}
