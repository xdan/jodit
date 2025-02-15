/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test Async module', () => {
	let asyncM,
		callCount = 0,
		rejectCount = 0,
		rejectSpy = type => () => {
			// console.log(type);
			rejectCount++;
		},
		callSpy = type => () => {
			// console.log(type);
			callCount++;
		};

	beforeEach(() => {
		unmockPromise();
		asyncM = new Jodit.modules.Async();
		callCount = 0;
		rejectCount = 0;
	});

	describe('All async tasks', () => {
		it('Should be called', async () => {
			asyncM.setTimeout(callSpy('timeout'), 100);
			asyncM
				.promise(r => Promise.resolve().then(r))
				.then(callSpy('promise'))
				.catch(e => null);
			asyncM.requestIdleCallback(callSpy('idle'));
			await delay(200);
			await idle();
			expect(callCount).equals(3);
		});

		describe('After the View was destroyed', () => {
			it('Should not be called', async () => {
				asyncM.setTimeout(callSpy('timeout'), 100);
				asyncM
					.promise(r => Promise.resolve().then(r))
					.then(callSpy('promise'))
					.catch(e => null);
				asyncM.requestIdleCallback(callSpy('idle'));
				asyncM.destruct();
				await delay(200);
				await idle();
				expect(callCount).equals(0);
			});

			describe('Jodit instance', () => {
				it('Should work the same way', async () => {
					const editor = getJodit();
					editor.async.setTimeout(callSpy('setTimeout'), 100);
					editor.async
						.promise(r => Promise.resolve().then(r))
						.then(callSpy('promise'))
						.catch(e => null);
					editor.async.requestIdleCallback(callSpy('idle'));
					editor.destruct();
					await delay(200);
					expect(callCount).equals(0);
				});
			});
		});
	});

	describe('Promise', () => {
		it('Should have method for rejection on the outside', async () => {
			const promise = asyncM.promise(r => Promise.resolve().then(r));

			promise.then(callSpy('promise')).catch(e => {
				expect(Jodit.modules.Helpers.isAbortError(e)).is.true;
				rejectSpy('promise')();
			});
			promise.rejectCallback();

			await asyncM.requestIdlePromise();
			expect(callCount).equals(0);
			expect(rejectCount).equals(1);
		});

		describe('Destroy module', () => {
			it('Should reject promise when module is destroyed', async () => {
				const promise = asyncM.promise(r => Promise.resolve().then(r));

				promise.then(callSpy('promise')).catch(e => {
					expect(Jodit.modules.Helpers.isAbortError(e)).is.true;
					rejectSpy('promise')();
				});

				asyncM.destruct();

				await new Promise(resolve => setTimeout(resolve, 4));
				expect(callCount).equals(0);
				expect(rejectCount).equals(1);
			});
		});
	});

	describe('setTimeout', () => {
		it('Should be called with number timeout', async () => {
			asyncM.setTimeout(callSpy('setTimeout'), 100);
			await delay(200);
			expect(callCount).equals(1);
		});

		it('Should be called with options', async () => {
			asyncM.setTimeout(callSpy('setTimeout'), { timeout: 100 });
			await delay(200);
			expect(callCount).equals(1);
		});

		describe('Clear', () => {
			it('Should be cleared with timeout id', async () => {
				const id = asyncM.setTimeout(callSpy('setTimeout'), {
					timeout: 100
				});
				asyncM.clearTimeout(id);
				await delay(200);
				expect(callCount).equals(0);
			});

			it('Should be cleared with timeout id', async () => {
				const id = asyncM.setTimeout(callSpy('setTimeout'), {
					timeout: 100
				});
				asyncM.clearTimeout(id);
				await delay(200);
				expect(callCount).equals(0);
			});

			describe('With label', () => {
				it('Should be cleared with label', async () => {
					asyncM.setTimeout(callSpy('timeout'), {
						timeout: 100,
						label: 'test'
					});
					asyncM.clearTimeout('test');
					await delay(200);
					expect(callCount).equals(0);
				});

				describe('Several call with one label', () => {
					it('Should clear previous call', async () => {
						asyncM.setTimeout(callSpy('timeout1'), {
							timeout: 100,
							label: 'test'
						});
						asyncM.setTimeout(callSpy('timeout2'), {
							timeout: 100,
							label: 'test'
						});
						asyncM.setTimeout(callSpy('timeout3'), {
							timeout: 100,
							label: 'test'
						});
						asyncM.setTimeout(callSpy('timeout4'), {
							timeout: 100,
							label: 'test'
						});
						asyncM.setTimeout(callSpy('timeout5'), {
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
			asyncM.requestAnimationFrame(callSpy('requestAnimationFrame'));
			/*ok*/ requestAnimationFrame(() => {
				expect(callCount).equals(1);
				done();
			});
		});

		describe('Clear', () => {
			it('Should not be called after destruct', done => {
				asyncM.requestAnimationFrame(callSpy('requestAnimationFrame'));
				asyncM.destruct();
				/*ok*/ requestAnimationFrame(() => {
					expect(callCount).equals(0);
					done();
				});
			});
		});
	});

	describe('Scheduler API', () => {
		it('should execute the task and resolve with the returned value', async function () {
			const result = await asyncM.schedulerPostTask(() => {
				return 'test result';
			});
			expect(result).to.equal('test result');
		});

		it('should catch errors thrown in the task and reject the promise', async function () {
			try {
				await asyncM.schedulerPostTask(() => {
					throw new Error('error test');
				});
				throw new Error('Promise should have been rejected');
			} catch (err) {
				expect(err).to.be.an('error');
				expect(err.message).to.equal('error test');
			}
		});

		it('should delay task execution when delay option is set', async function () {
			const start = Date.now();
			await asyncM.schedulerPostTask(
				() => {
					return 'done';
				},
				{ delay: 100 }
			);
			const end = Date.now();
			expect(end - start).to.be.at.least(100);
		});

		it('should abort the task if signal is aborted', async function () {
			const controller = new AbortController();
			const { signal } = controller;
			controller.abort();

			try {
				await asyncM.schedulerPostTask(
					() => {
						return 'should not run';
					},
					{ signal }
				);
				throw new Error('Task should be aborted and promise rejected');
			} catch (err) {
				expect(err).to.exist;
			}
		});

		it('Should call as usual', done => {
			asyncM.schedulerPostTask(callSpy('schedulerPostTask'));
			asyncM.schedulerPostTask(callSpy('schedulerPostTask'));
			asyncM.schedulerPostTask(callSpy('schedulerPostTask'));
			asyncM.schedulerPostTask(callSpy('schedulerPostTask'));
			asyncM.setTimeout(() => {
				expect(callCount).equals(4);
				done();
			}, 100);
		});

		describe('Clear', () => {
			it('Should not be called after destruct', done => {
				asyncM.schedulerPostTask(callSpy('schedulerPostTask'));
				asyncM.destruct();
				setTimeout(() => {
					expect(callCount).equals(0);
					done();
				});
			}, 100);

			it('Should abort by signal', done => {
				const controller = new AbortController();
				asyncM.schedulerPostTask(callSpy('schedulerPostTask'), {
					signal: controller.signal
				});
				controller.abort();
				setTimeout(() => {
					expect(callCount).equals(0);
					done();
				});
			}, 100);
		});
	});
});
