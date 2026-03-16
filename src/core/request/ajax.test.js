/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Ajax module', () => {
	describe('Constructor', () => {
		it('Should allow to expand options', () => {
			const async = new Jodit.modules.Ajax({ someField: 1, timeout: 10 });
			expect(async.options.timeout).equals(10);
			expect(async.options.headers).deep.equals({
				'X-REQUESTED-WITH': 'XMLHttpRequest'
			});
			expect(async.options.successStatuses).deep.equals([200, 201, 202]);
			expect(async.options.someField).equals(1);
		});
	});

	describe('stream', () => {
		/**
		 * Creates a mock XHR that delivers SSE text in chunks via onprogress,
		 * then fires onload when all chunks are delivered.
		 *
		 * @param {string[]} chunks - Array of text chunks to deliver sequentially
		 * @param {number} [delayMs=10] - Delay between chunks in ms
		 * @returns {function} XHR factory compatible with AjaxOptions.xhr
		 */
		function createStreamingMockXHR(chunks, delayMs) {
			delayMs = delayMs || 10;

			return function () {
				const xhr = {
					open: function () {},
					setRequestHeader: function () {},
					send: function () {
						let fullText = '';
						let index = 0;

						function next() {
							if (index >= chunks.length) {
								xhr.readyState = 4;
								xhr.status = 200;
								if (xhr.onload) {
									xhr.onload();
								}
								return;
							}

							fullText += chunks[index];
							xhr.responseText = fullText;
							xhr.readyState = 3;
							index++;

							if (xhr.onprogress) {
								xhr.onprogress({});
							}

							setTimeout(next, delayMs);
						}

						setTimeout(next, delayMs);
					},
					abort: function () {
						if (xhr.onabort) {
							xhr.onabort();
						}
					},
					responseText: '',
					readyState: 0,
					status: 0,
					statusText: '',
					withCredentials: false,
					onprogress: null,
					onload: null,
					onerror: null,
					onabort: null,
					onreadystatechange: null
				};

				return xhr;
			};
		}

		beforeEach(function () {
			unmockPromise();
		});

		afterEach(function () {
			mockPromise();
		});

		it('Should parse a single SSE event', async () => {
			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: createStreamingMockXHR(['data: hello\n\n'])
			});

			const results = [];
			for await (const data of ajax.stream()) {
				results.push(data);
			}

			expect(results).deep.equals(['hello']);
			ajax.destruct();
		});

		it('Should parse multiple SSE events', async () => {
			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: createStreamingMockXHR([
					'data: first\n\ndata: second\n\ndata: third\n\n'
				])
			});

			const results = [];
			for await (const data of ajax.stream()) {
				results.push(data);
			}

			expect(results).deep.equals(['first', 'second', 'third']);
			ajax.destruct();
		});

		it('Should handle chunked delivery across multiple progress events', async () => {
			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: createStreamingMockXHR([
					'data: fir',
					'st\n\nda',
					'ta: second\n\n'
				])
			});

			const results = [];
			for await (const data of ajax.stream()) {
				results.push(data);
			}

			expect(results).deep.equals(['first', 'second']);
			ajax.destruct();
		});

		it('Should handle multi-line data events', async () => {
			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: createStreamingMockXHR([
					'data: line1\ndata: line2\ndata: line3\n\n'
				])
			});

			const results = [];
			for await (const data of ajax.stream()) {
				results.push(data);
			}

			expect(results).deep.equals(['line1\nline2\nline3']);
			ajax.destruct();
		});

		it('Should parse JSON data from SSE events', async () => {
			const events = [
				'data: {"type":"start"}\n\n',
				'data: {"type":"token","text":"hello"}\n\n',
				'data: {"type":"end"}\n\n'
			];

			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: createStreamingMockXHR(events)
			});

			const results = [];
			for await (const data of ajax.stream()) {
				results.push(JSON.parse(data));
			}

			expect(results).deep.equals([
				{ type: 'start' },
				{ type: 'token', text: 'hello' },
				{ type: 'end' }
			]);
			ajax.destruct();
		});

		it('Should ignore non-data SSE fields (event, id, retry, comments)', async () => {
			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: createStreamingMockXHR([
					': this is a comment\n\n',
					'event: message\ndata: hello\nid: 1\n\n',
					'retry: 5000\n\n',
					'data: world\n\n'
				])
			});

			const results = [];
			for await (const data of ajax.stream()) {
				results.push(data);
			}

			expect(results).deep.equals(['hello', 'world']);
			ajax.destruct();
		});

		it('Should handle data: without space after colon', async () => {
			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: createStreamingMockXHR([
					'data:no-space\n\ndata: with-space\n\n'
				])
			});

			const results = [];
			for await (const data of ajax.stream()) {
				results.push(data);
			}

			expect(results).deep.equals(['no-space', 'with-space']);
			ajax.destruct();
		});

		it('Should flush remaining buffer on connection close', async () => {
			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: createStreamingMockXHR([
					'data: first\n\ndata: last'
				])
			});

			const results = [];
			for await (const data of ajax.stream()) {
				results.push(data);
			}

			// "data: last" without trailing \n\n should be flushed on close
			expect(results).deep.equals(['first', 'last']);
			ajax.destruct();
		});

		it('Should abort XHR when breaking out of the loop', async () => {
			let aborted = false;

			const xhrFactory = function () {
				const xhr = {
					open: function () {},
					setRequestHeader: function () {},
					send: function () {
						let count = 0;

						function next() {
							count++;
							xhr.responseText += 'data: event' + count + '\n\n';
							xhr.readyState = 3;

							if (xhr.onprogress) {
								xhr.onprogress({});
							}

							if (count < 100) {
								setTimeout(next, 5);
							}
						}

						setTimeout(next, 5);
					},
					abort: function () {
						aborted = true;
						if (xhr.onabort) {
							xhr.onabort();
						}
					},
					responseText: '',
					readyState: 0,
					status: 0,
					withCredentials: false,
					onprogress: null,
					onload: null,
					onerror: null,
					onabort: null,
					onreadystatechange: null
				};

				return xhr;
			};

			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: xhrFactory
			});

			const results = [];
			for await (const data of ajax.stream()) {
				results.push(data);

				if (results.length >= 3) {
					break;
				}
			}

			expect(results.length).equals(3);
			expect(results[0]).equals('event1');
			expect(aborted).is.true;
			ajax.destruct();
		});

		it('Should abort XHR on destruct during active stream', async () => {
			let aborted = false;

			const xhrFactory = function () {
				const xhr = {
					open: function () {},
					setRequestHeader: function () {},
					send: function () {
						// Deliver one event, then go silent (simulate slow stream)
						setTimeout(function () {
							xhr.responseText = 'data: first\n\n';
							xhr.readyState = 3;

							if (xhr.onprogress) {
								xhr.onprogress({});
							}
						}, 5);
					},
					abort: function () {
						aborted = true;

						if (xhr.onabort) {
							xhr.onabort();
						}
					},
					responseText: '',
					readyState: 0,
					status: 0,
					withCredentials: false,
					onprogress: null,
					onload: null,
					onerror: null,
					onabort: null,
					onreadystatechange: null
				};

				return xhr;
			};

			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: xhrFactory
			});

			const results = [];
			let caughtError = null;

			try {
				for await (const data of ajax.stream()) {
					results.push(data);
					// After getting first event, destruct the ajax
					ajax.destruct();
				}
			} catch (e) {
				caughtError = e;
			}

			expect(results).deep.equals(['first']);
			expect(aborted).is.true;
			expect(caughtError).is.not.null;
		});

		it('Should throw on connection error', async () => {
			const xhrFactory = function () {
				const xhr = {
					open: function () {},
					setRequestHeader: function () {},
					send: function () {
						setTimeout(function () {
							if (xhr.onerror) {
								xhr.onerror();
							}
						}, 5);
					},
					abort: function () {},
					responseText: '',
					readyState: 0,
					status: 0,
					withCredentials: false,
					onprogress: null,
					onload: null,
					onerror: null,
					onabort: null,
					onreadystatechange: null
				};

				return xhr;
			};

			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: xhrFactory
			});

			let caughtError = null;

			try {
				for await (const data of ajax.stream()) {
					// Should not reach here
				}
			} catch (e) {
				caughtError = e;
			}

			expect(caughtError).is.not.null;
			expect(caughtError.message).equals('Connection error');
			ajax.destruct();
		});

		it('Should handle empty stream (immediate close with no events)', async () => {
			const ajax = new Jodit.modules.Ajax({
				url: 'https://example.com/stream',
				xhr: createStreamingMockXHR([])
			});

			const results = [];
			for await (const data of ajax.stream()) {
				results.push(data);
			}

			expect(results).deep.equals([]);
			ajax.destruct();
		});
	});
});
