/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Speech Recognize', () => {
	describe('Toolbar', () => {
		it('Should create toolbar with speech button', () => {
			const editor = getJodit({
				toolbarAdaptive: false,
				speechRecognize: {
					api: {} // Mock for FF
				}
			});

			const speechButton = getButton('speechRecognize', editor);

			expect(speechButton).is.not.null;
		});

		describe('Is not supported', () => {
			it('Should not show speech button', () => {
				const editor = getJodit({
					toolbarAdaptive: false,
					speechRecognize: {
						api: null
					}
				});

				const speechButton = getButton('speechRecognize', editor);

				expect(speechButton).is.null;
			});
		});
	});

	describe('Sound', () => {
		// Regression: a new AudioContext used to be created on every beep and
		// never closed, leaking until the browser limit was hit and the audio
		// turned into a "roar". The manager must reuse one context and close it.
		it('Should reuse a single AudioContext for every beep and close it on destruct', () => {
			const OriginalAudioContext = window.AudioContext;
			const OriginalWebkit = window.webkitAudioContext;

			let constructed = 0;
			let closed = 0;

			function FakeOscillator() {
				this.frequency = {};
				this.type = '';
			}
			FakeOscillator.prototype.connect = function () {};
			FakeOscillator.prototype.start = function () {};
			FakeOscillator.prototype.stop = function () {};

			function FakeGain() {
				this.gain = {};
			}
			FakeGain.prototype.connect = function () {};

			function FakeAudioContext() {
				constructed += 1;
				this.state = 'running';
				this.currentTime = 0;
				this.destination = {};
			}
			FakeAudioContext.prototype.createGain = function () {
				return new FakeGain();
			};
			FakeAudioContext.prototype.createOscillator = function () {
				return new FakeOscillator();
			};
			FakeAudioContext.prototype.close = function () {
				closed += 1;
				this.state = 'closed';
				return Promise.resolve();
			};

			window.AudioContext = FakeAudioContext;
			window.webkitAudioContext = FakeAudioContext;

			let apiInstance = null;

			function MockSpeechApi() {
				this.lang = '';
				this.interimResults = false;
				this.continuous = false;
				this._listeners = {};
				apiInstance = this;
			}
			MockSpeechApi.prototype.addEventListener = function (event, cb) {
				(this._listeners[event] = this._listeners[event] || []).push(
					cb
				);
			};
			MockSpeechApi.prototype.removeEventListener = function (event, cb) {
				if (this._listeners[event]) {
					this._listeners[event] = this._listeners[event].filter(
						x => x !== cb
					);
				}
			};
			MockSpeechApi.prototype.start = function () {};
			MockSpeechApi.prototype.stop = function () {};
			MockSpeechApi.prototype.abort = function () {};
			MockSpeechApi.prototype.fire = function (event, data) {
				(this._listeners[event] || []).slice().forEach(cb => cb(data));
			};

			function makeResult(transcript) {
				const item = {
					isFinal: true,
					length: 1,
					item: function () {
						return { transcript: transcript };
					}
				};
				return {
					resultIndex: 0,
					results: {
						length: 1,
						item: function () {
							return item;
						}
					}
				};
			}

			const editor = getJodit({
				toolbarAdaptive: false,
				speechRecognize: {
					api: MockSpeechApi,
					sound: true
				}
			});

			try {
				// Start recognition: creates the manager and attaches listeners.
				clickButton('speechRecognize', editor);

				expect(apiInstance).is.not.null;

				// Each final result + end pair triggers one beep (_makeSound).
				for (let i = 0; i < 5; i += 1) {
					apiInstance.fire('result', makeResult('word ' + i));
					apiInstance.fire('end', {});
				}

				// The fix: one shared AudioContext, not one per beep.
				expect(constructed).equals(1);

				editor.destruct();

				// Destruct must release the context.
				expect(closed).equals(1);
			} finally {
				window.AudioContext = OriginalAudioContext;
				window.webkitAudioContext = OriginalWebkit;
			}
		});
	});
});
