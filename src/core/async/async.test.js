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
		it('Should be called', done => {
			asyncM.setTimeout(callSpy, 100);
			asyncM
				.promise(r => Promise.resolve().then(r))
				.then(callSpy)
				.catch(e => null);
			asyncM.requestIdleCallback(callSpy);

			setTimeout(() => {
				expect(callCount).equals(3);
				done();
			}, 200);
		});

		describe('After View was destroyed', () => {
			it('Should not be called', done => {
				asyncM.setTimeout(callSpy, 100);
				asyncM
					.promise(r => Promise.resolve().then(r))
					.then(callSpy)
					.catch(e => null);
				asyncM.requestIdleCallback(callSpy);
				asyncM.destruct();

				setTimeout(() => {
					expect(callCount).equals(0);
					done();
				}, 200);
			});

			describe('Jodit instance', () => {
				it('Should work same way', done => {
					const editor = getJodit();
					editor.async.setTimeout(callSpy, 100);
					editor.async
						.promise(r => Promise.resolve().then(r))
						.then(callSpy)
						.catch(e => null);
					editor.async.requestIdleCallback(callSpy);
					editor.destruct();

					setTimeout(() => {
						expect(callCount).equals(0);
						done();
					}, 200);
				});
			});
		});
	});

	describe('Promise', () => {
		it('Should has method for rejection in the outside', done => {
			const promise = asyncM.promise(r => Promise.resolve().then(r));

			promise.then(callSpy).catch(e => null);
			promise.rejectCallback();

			setTimeout(() => {
				expect(callCount).equals(0);
				done();
			}, 200);
		});
	});

	describe('setTimeout', () => {
		it('Should can be called with number timeout', done => {
			asyncM.setTimeout(callSpy, 100);
			setTimeout(() => {
				expect(callCount).equals(1);
				done();
			}, 200);
		});

		it('Should can be called with options', done => {
			asyncM.setTimeout(callSpy, { timeout: 100 });
			setTimeout(() => {
				expect(callCount).equals(1);
				done();
			}, 200);
		});

		describe('Clear', () => {
			it('Should can be cleared with timeout id', done => {
				const id = asyncM.setTimeout(callSpy, { timeout: 100 });
				asyncM.clearTimeout(id);
				setTimeout(() => {
					expect(callCount).equals(0);
					done();
				}, 200);
			});

			it('Should can be cleared with timeout id', done => {
				const id = asyncM.setTimeout(callSpy, { timeout: 100 });
				asyncM.clearTimeout(id);
				setTimeout(() => {
					expect(callCount).equals(0);
					done();
				}, 200);
			});

			describe('With label', () => {
				it('Should can be cleared with label', done => {
					asyncM.setTimeout(callSpy, { timeout: 100, label: 'test' });
					asyncM.clearTimeout('test');
					setTimeout(() => {
						expect(callCount).equals(0);
						done();
					}, 200);
				});

				describe('Several call with one label', () => {
					it('Should clear previous call', done => {
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

						setTimeout(() => {
							expect(callCount).equals(2);
							done();
						}, 200);
					});
				});
			});
		});

		describe('Update', () => {
			it('Can be updated', done => {
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

				setTimeout(() => {
					asyncM.updateTimeout('test', 100);
					setTimeout(() => {
						asyncM.updateTimeout('test', 100);
						setTimeout(() => {
							expect(callTime - time).is.above(200);
							done();
						}, 200);
					}, 70);
				}, 70);
			});
		});
	});

	describe('requestAnimationFrame', () => {
		it('Should call as usual requestAnimationFrame', done => {
			asyncM.requestAnimationFrame(callSpy);
			requestAnimationFrame(() => {
				expect(callCount).equals(1);
				done();
			});
		});

		describe('Clear', () => {
			it('Should not be called after destruct', done => {
				asyncM.requestAnimationFrame(callSpy);
				asyncM.destruct();
				requestAnimationFrame(() => {
					expect(callCount).equals(0);
					done();
				});
			});
		});
	});
});
