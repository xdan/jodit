/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test Async module', () => {
	let asyncM,
		callCount = 0,
		callSpy = () => {
			callCount++;
		};

	beforeEach(() => {
		unmockPromise();
		asyncM = new Jodit.modules.Async();
		callCount = 0;
	});

	describe('All async tasks', () => {
		it('Should be called', async () => {
			asyncM.setTimeout(callSpy, 100);
			asyncM
				.promise(r => Promise.resolve().then(r))
				.then(callSpy)
				.catch(e => null);
			asyncM.requestIdleCallback(callSpy);

			await delay(200);
			expect(callCount).equals(3);
		});

		describe('After View was destroyed', () => {
			it('Should not be called', async () => {
				asyncM.setTimeout(callSpy, 100);
				asyncM
					.promise(r => Promise.resolve().then(r))
					.then(callSpy)
					.catch(e => null);
				asyncM.requestIdleCallback(callSpy);
				asyncM.destruct();
				await delay(200);
				expect(callCount).equals(0);
			});

			describe('Jodit instance', () => {
				it('Should work same way', async () => {
					const editor = getJodit();
					editor.async.setTimeout(callSpy, 100);
					editor.async
						.promise(r => Promise.resolve().then(r))
						.then(callSpy)
						.catch(e => null);
					editor.async.requestIdleCallback(callSpy);
					editor.destruct();
					await delay(200);
					expect(callCount).equals(0);
				});
			});
		});
	});

	describe('Promise', () => {
		it('Should has method for rejection in the outside', async () => {
			const promise = asyncM.promise(r => Promise.resolve().then(r));

			promise.then(callSpy).catch(e => null);
			promise.rejectCallback();

			await delay(200);
			expect(callCount).equals(0);
		});
	});

	describe('setTimeout', () => {
		it('Should can be called with number timeout', async () => {
			asyncM.setTimeout(callSpy, 100);
			await delay(200);
			expect(callCount).equals(1);
		});

		it('Should can be called with options', async () => {
			asyncM.setTimeout(callSpy, { timeout: 100 });
			await delay(200);
			expect(callCount).equals(1);
		});

		describe('Clear', () => {
			it('Should can be cleared with timeout id', async () => {
				const id = asyncM.setTimeout(callSpy, { timeout: 100 });
				asyncM.clearTimeout(id);
				await delay(200);
				expect(callCount).equals(0);
			});

			it('Should can be cleared with timeout id', async () => {
				const id = asyncM.setTimeout(callSpy, { timeout: 100 });
				asyncM.clearTimeout(id);
				await delay(200);
				expect(callCount).equals(0);
			});

			describe('With label', () => {
				it('Should can be cleared with label', async () => {
					asyncM.setTimeout(callSpy, { timeout: 100, label: 'test' });
					asyncM.clearTimeout('test');
					await delay(200);
					expect(callCount).equals(0);
				});

				describe('Several call with one label', () => {
					it('Should clear previous call', async () => {
						asyncM.setTimeout(callSpy, {
							timeout: 100,
							label: 'test'
						});
						asyncM.setTimeout(callSpy, {
							timeout: 100,
							label: 'test'
						});
						asyncM.setTimeout(callSpy, {
							timeout: 100,
							label: 'test'
						});
						asyncM.setTimeout(callSpy, {
							timeout: 100,
							label: 'test'
						});
						asyncM.setTimeout(callSpy, {
							timeout: 100
						});

						await delay(200);

						expect(callCount).equals(2);
					});
				});
			});
		});

		describe('Update', () => {
			it('Can be updated', async () => {
				const time = new Date().getTime();
				let callTime;

				asyncM.setTimeout(
					() => {
						callTime = new Date().getTime();
					},
					{
						label: 'test',
						timeout: 100
					}
				);

				await delay(70);

				asyncM.updateTimeout('test', 100);

				await delay(70);
				asyncM.updateTimeout('test', 100);

				await delay(200);
				expect(callTime - time).is.above(200);
			});
		});
	});

	describe('requestAnimationFrame', () => {
		it('Should call as usual requestAnimationFrame', done => {
			asyncM.requestAnimationFrame(callSpy);
			/*ok*/ requestAnimationFrame(() => {
				expect(callCount).equals(1);
				done();
			});
		});

		describe('Clear', () => {
			it('Should not be called after destruct', done => {
				asyncM.requestAnimationFrame(callSpy);
				asyncM.destruct();
				/*ok*/ requestAnimationFrame(() => {
					expect(callCount).equals(0);
					done();
				});
			});
		});
	});
});
