/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

// eslint-disable-next-line max-classes-per-file
describe('Readiness', () => {
	describe('Method waitForReady', () => {
		describe('Custom plugin', () => {
			let cssLoaded = false;
			let afterInitCalledCount = 0;
			let beforeDestructCalled = false;
			let resolveWaitingInit = null;
			let promiseWaitingInit = new Promise(r => {
				resolveWaitingInit = r;
			});

			class Custom3 extends Jodit.modules.Plugin {
				afterInit(jodit) {
					afterInitCalledCount += 1;
				}
				beforeDestruct() {
					beforeDestructCalled = true;
				}
			}

			class Custom extends Custom3 {
				hasStyle = true;
			}

			// No mocked styles
			class Custom2 extends Custom3 {
				hasStyle = true;
			}

			class Custom4 extends Custom3 {}

			class Custom5 extends Custom3 {
				static requires = ['custom4'];
			}

			class Custom6 extends Custom3 {
				static requires = ['custom4'];
				afterInit(jodit) {
					resolveWaitingInit();
					return super.afterInit(jodit);
				}
			}

			beforeEach(() => {
				unmockPromise();

				cssLoaded = false;
				afterInitCalledCount = 0;
				beforeDestructCalled = false;

				Jodit.modules.Helpers.alreadyLoadedList.set(
					`${Jodit.constants.BASE_PATH}plugins/custom/custom.css`,
					{
						// Super hacky way to handle the consuming of the css file loading
						then() {
							cssLoaded = true;
							return Promise.resolve();
						}
					}
				);

				Jodit.modules.Helpers.alreadyLoadedList.set(
					`${Jodit.constants.BASE_PATH}plugins/custom4/custom4.js`,
					{
						then() {
							Jodit.plugins.add('custom4', Custom4);
							return Promise.resolve();
						}
					}
				);

				Jodit.modules.Helpers.alreadyLoadedList.set(
					`${Jodit.constants.BASE_PATH}plugins/custom6/custom6.js`,
					{
						then() {
							Jodit.plugins.add('custom6', Custom6);
							return Promise.resolve();
						}
					}
				);
			});

			afterEach(() => {
				Jodit.plugins.remove('custom');
				Jodit.plugins.remove('custom2');
				Jodit.plugins.remove('custom3');
				Jodit.plugins.remove('custom4');
				Jodit.plugins.remove('custom5');
				Jodit.plugins.remove('custom6');
				Jodit.modules.Helpers.alreadyLoadedList.delete(
					`${Jodit.constants.BASE_PATH}plugins/custom/custom.css`
				);
				Jodit.modules.Helpers.alreadyLoadedList.delete(
					`${Jodit.constants.BASE_PATH}plugins/custom4/custom4.js`
				);
				Jodit.modules.Helpers.alreadyLoadedList.delete(
					`${Jodit.constants.BASE_PATH}plugins/custom6/custom6.js`
				);
			});

			describe('With existing styles', () => {
				it('Should load and resolve promise', async () => {
					Jodit.plugins.add('custom', Custom);

					const jodit = getJodit({
						minified: false,
						extraPlugins: ['custom']
					});

					expect(jodit.isReady).is.true;

					await jodit.waitForReady().then(j => {
						expect(jodit).eq(j);
						expect(jodit.isReady).is.true;
					});

					expect(cssLoaded).is.true;
					expect(afterInitCalledCount).eq(1);
					expect(beforeDestructCalled).is.false;
				});
			});

			describe('With not existing styles', () => {
				it('Should still resolve promise', async () => {
					Jodit.plugins.add('custom2', Custom2);

					const jodit = getJodit({
						minified: false,
						extraPlugins: ['custom2']
					});

					expect(jodit.isReady).is.true;

					await jodit.waitForReady().then(j => {
						expect(jodit).eq(j);
						expect(jodit.isReady).is.true;
					});

					expect(cssLoaded).is.false;
					expect(afterInitCalledCount).eq(1);
					expect(beforeDestructCalled).is.false;
				});
			});

			describe('Without styles', () => {
				it('Should still resolve promise', async () => {
					Jodit.plugins.add('custom3', Custom3);

					const jodit = getJodit({
						minified: false,
						extraPlugins: ['custom3']
					});

					expect(jodit.isReady).is.true;

					await jodit.waitForReady().then(j => {
						expect(jodit).eq(j);
						expect(jodit.isReady).is.true;
					});

					expect(cssLoaded).is.false;
					expect(afterInitCalledCount).eq(1);
					expect(beforeDestructCalled).is.false;
				});
			});

			describe('With loadable plugin', () => {
				it('Should wait for load and resolve promise', async () => {
					const jodit = getJodit({
						minified: false,
						extraPlugins: ['custom4']
					});

					expect(jodit.isReady).is.true;

					await jodit.waitForReady().then(j => {
						expect(jodit).eq(j);
						expect(jodit.isReady).is.true;
					});

					expect(cssLoaded).is.false;
					expect(afterInitCalledCount).eq(1);
					expect(beforeDestructCalled).is.false;
				});

				describe('With required defined plugins', () => {
					it('Should resolve just promise', async () => {
						Jodit.plugins.add('custom4', Custom4);
						Jodit.plugins.add('custom5', Custom5);

						const jodit = getJodit({
							minified: false,
							extraPlugins: ['custom5']
						});

						expect(jodit.isReady).is.true;

						await jodit.waitForReady().then(j => {
							expect(jodit).eq(j);
							expect(jodit.isReady).is.true;
						});

						expect(cssLoaded).is.false;
						expect(afterInitCalledCount).eq(2);
						expect(beforeDestructCalled).is.false;
					});
				});

				describe('With required loadable plugin', () => {
					it('Should resolve promise and after this waiting for loading', async () => {
						const jodit = getJodit({
							minified: false,
							extraPlugins: ['custom6', 'custom4']
						});

						expect(jodit.isReady).is.true;

						await jodit.waitForReady().then(j => {
							expect(jodit).eq(j);
							expect(jodit.isReady).is.true;
						});

						expect(afterInitCalledCount).eq(2);

						await promiseWaitingInit;

						expect(afterInitCalledCount).eq(2);
					});

					describe('For not defined plugin in requires', () => {
						it('Should not init custom plugin', async () => {
							const jodit = getJodit({
								minified: false,
								extraPlugins: ['custom6']
							});

							expect(jodit.isReady).is.true;

							await jodit.waitForReady().then(j => {
								expect(jodit).eq(j);
								expect(jodit.isReady).is.true;
							});

							expect(afterInitCalledCount).eq(0);
						});
					});
				});
			});
		});

		describe('Sync init', () => {
			it('Should return resolved promise', done => {
				const jodit = getJodit({
					minified: false
				});

				expect(jodit.isReady).is.true;

				jodit.waitForReady().then(j => {
					expect(jodit).eq(j);
					expect(jodit.isReady).is.true;
					done();
				});
			});
		});

		describe('Composition event', () => {
			it('should handle normal', () => {
				const jodit = getJodit({
					minified: false,
					defaultTimeout: 0
				});

				jodit.value = '<p>test</p>';

				simulateEvent('compositionend', jodit.editor);
				expect(jodit.value).eq('<p>test</p>');
			});
		});

		describe('Async init', () => {
			it('Should return resolved promise', done => {
				const timers = mockTimers();
				unmockPromise();

				const jodit = getJodit({
					events: {
						createEditor: () => delay(100)
					}
				});

				expect(jodit.isReady).is.false;
				timers.delay(700);

				jodit.waitForReady().then(j => {
					expect(jodit).eq(j);
					expect(jodit.isReady).is.true;
					timers.cleanup();
					done();
				});
			});
		});
	});
});
