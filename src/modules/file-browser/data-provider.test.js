/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('File browser data provider requests', function () {
	let editor, dp, aborted, sent, originalAbort, originalSend;

	beforeEach(function () {
		editor = getJodit({
			filebrowser: {
				ajax: {
					url: 'https://xdsoft.net/jodit/connector/index.php'
				}
			}
		});
		dp = editor.filebrowser.dataProvider;

		aborted = 0;
		sent = [];

		const { Ajax } = Jodit.modules;
		originalAbort = Ajax.prototype.abort;
		originalSend = Ajax.prototype.send;

		Ajax.prototype.abort = function () {
			aborted += 1;
			return originalAbort.call(this);
		};

		// Keep the request open long enough for a second one to be issued
		// while it is still in flight. Removals are answered here, so the
		// test does not depend on what the harness mock knows about them;
		// everything else goes to the mock.
		Ajax.prototype.send = function () {
			const request = this.prepareRequest();
			const action =
				request.data.action || /action=(\w+)/.exec(request.url)?.[1];
			sent.push(action);

			if (action === 'fileRemove') {
				return new Promise(resolve => {
					setTimeout(
						() =>
							resolve({
								json: () =>
									Promise.resolve({
										success: true,
										data: { code: 220 }
									})
							}),
						30
					);
				});
			}

			// Listings go to the harness mock, but only after a tick, so a
			// second request can be issued while the first is still open.
			const ajax = this;
			return new Promise(resolve => {
				setTimeout(() => resolve(originalSend.call(ajax)), 30);
			});
		};
	});

	afterEach(function () {
		const { Ajax } = Jodit.modules;
		Ajax.prototype.abort = originalAbort;
		Ajax.prototype.send = originalSend;
	});

	it('Should let several removals run side by side without aborting any of them', async function () {
		const results = await Promise.allSettled([
			dp.fileRemove('/', 'a.jpg', 'default'),
			dp.fileRemove('/', 'b.jpg', 'default'),
			dp.fileRemove('/', 'c.jpg', 'default')
		]);

		expect(aborted).equals(0);
		expect(sent.filter(a => a === 'fileRemove').length).equals(3);
		expect(results.every(r => r.status === 'fulfilled')).is.true;
	});

	it('Should still replace a listing that is asked for again', async function () {
		const first = dp.items('/', 'default').catch(() => 'aborted');
		const second = dp.items('/', 'default');

		await Promise.allSettled([first, second]);

		expect(aborted).equals(1);
	});
});
