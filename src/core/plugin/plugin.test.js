/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
// eslint-disable-next-line max-classes-per-file
describe('Plugin system test', () => {
	before(() => {
		Jodit.defaultOptions.controls.test = {
			name: 'test'
		};
		Jodit.defaultOptions.beautifyHTML = false;
	});

	after(() => {
		delete Jodit.defaultOptions.controls.test;
		Jodit.defaultOptions.beautifyHTML = false;
	});

	describe('Plain init plugin', () => {
		it('should run plugin', () => {
			const calledTime = {
				destruct: 0,
				init: 0
			};
			Jodit.plugins.add('test', {
				init(jodit) {
					expect(jodit instanceof Jodit).is.true;
					calledTime.init++;
				},
				destruct() {
					calledTime.destruct++;
				}
			});
			const editor = getJodit();
			expect(calledTime.init).equals(1);
			expect(calledTime.destruct).equals(0);
			editor.destruct();
			expect(calledTime.init).equals(1);
			expect(calledTime.destruct).equals(1);
			const editor2 = getJodit();
			expect(calledTime.init).equals(2);
			expect(calledTime.destruct).equals(1);
			editor2.destruct();
			expect(calledTime.init).equals(2);
			expect(calledTime.destruct).equals(2);
			Jodit.plugins.remove('test');
		});
	});

	describe('Class plugin', () => {
		let calledTime;
		beforeEach(() => {
			calledTime = {
				destruct: 0,
				init: 0
			};
			Jodit.plugins.add(
				'test',
				class extends Jodit.modules.Plugin {
					buttons = [
						{
							name: 'test',
							group: 'font-style'
						}
					];
					afterInit(jodit) {
						expect(jodit instanceof Jodit).is.true;
						calledTime.init++;
					}
					beforeDestruct() {
						calledTime.destruct++;
					}
				}
			);
		});

		afterEach(() => {
			Jodit.plugins.remove('test');
		});

		it('should run plugin', () => {
			const editor = getJodit();
			expect(calledTime.init).equals(1);
			expect(calledTime.destruct).equals(0);
			editor.destruct();
			expect(calledTime.init).equals(1);
			expect(calledTime.destruct).equals(1);
			const editor2 = getJodit();
			expect(calledTime.init).equals(2);
			expect(calledTime.destruct).equals(1);
			editor2.destruct();
			expect(calledTime.init).equals(2);
			expect(calledTime.destruct).equals(2);
		});

		describe('Buttons', () => {
			it('should register buttons in groups', () => {
				const editor = getJodit({
					removeButtons: ['changeCase'],
					buttons: [
						{
							group: 'font-style',
							buttons: []
						}
					]
				});
				expect(
					editor.toolbar.buttons.map(b => b.state.name)
				).deep.equals([
					'bold',
					'italic',
					'underline',
					'strikethrough',
					'eraser',
					'test'
				]);
				Jodit.plugins.remove('test');
			});
		});

		describe('Disable plugins', () => {
			it('should not init plug in', () => {
				const editor = getJodit({
					disablePlugins: ['test']
				});
				expect(calledTime.init).equals(0);
				expect(calledTime.destruct).equals(0);
			});
		});
	});

	describe('Function plugin', () => {
		it('should run plugin', () => {
			let calledTime = 0;
			Jodit.plugins.add('test', jodit => {
				expect(jodit instanceof Jodit).is.true;
				calledTime++;
			});
			const editor = getJodit();
			expect(calledTime).equals(1);
			editor.destruct();
			const editor2 = getJodit();
			expect(calledTime).equals(2);
			editor2.destruct();
			Jodit.plugins.remove('test');
		});
	});

	describe('Require plugin', () => {
		let callOrder;

		beforeEach(() => {
			callOrder = [];
			Jodit.plugins.add(
				'first',
				class extends Jodit.modules.Plugin {
					static requires = ['second'];

					afterInit() {
						callOrder.push('first');
					}
					beforeDestruct() {}
				}
			);

			Jodit.plugins.add(
				'third',
				class extends Jodit.modules.Plugin {
					static requires = ['first'];

					afterInit() {
						callOrder.push('third');
					}
					beforeDestruct() {}
				}
			);

			Jodit.plugins.add(
				'second',
				class extends Jodit.modules.Plugin {
					afterInit() {
						callOrder.push('second');
					}
					beforeDestruct() {}
				}
			);
		});

		afterEach(() => {
			Jodit.plugins.remove('first');
			Jodit.plugins.remove('second');
			Jodit.plugins.remove('third');
		});

		it('should init plugin only after required', () => {
			getJodit();
			expect(callOrder).deep.equals(['second', 'first', 'third']);
		});

		describe('Disable required plugin', () => {
			it('should not init plug in', () => {
				getJodit({
					disablePlugins: ['second']
				});
				expect(callOrder).deep.equals([]);

				getJodit({
					disablePlugins: ['first']
				});
				expect(callOrder).deep.equals(['second']);
				callOrder.length = 0;

				getJodit({
					disablePlugins: ['third']
				});
				expect(callOrder).deep.equals(['second', 'first']);
			});
		});
	});

	describe('Extra plugin', () => {
		let originalCreateElement, pleaseInited;

		beforeEach(() => {
			unmockPromise();
			originalCreateElement = document.createElement;
			pleaseInited = false;
			Object.defineProperty(document, 'createElement', {
				value: function (tagName) {
					if (tagName === 'script') {
						const script = originalCreateElement.call(
							this,
							'script'
						);

						const originalSetAttribute = script.setAttribute;
						Object.defineProperty(script, 'setAttribute', {
							value: function (k, v) {
								if (k !== 'src') {
									originalSetAttribute.call(this, k, v);
								}
							}
						});

						setTimeout(() => {
							Jodit.plugins.add(
								'please',
								class extends Jodit.modules.Plugin {
									buttons = [
										{
											name: 'test',
											group: 'font-style'
										}
									];
									afterInit(jodit) {
										expect(jodit instanceof Jodit).is.true;
										pleaseInited = true;
									}
									beforeDestruct() {}
								}
							);
							simulateEvent('load', script);
						}, 100);
						return script;
					}
					return originalCreateElement.call(this, tagName);
				},
				configurable: true,
				writable: true
			});
		});

		afterEach(() => {
			mockPromise();
			Object.defineProperty(document, 'createElement', {
				value: originalCreateElement
			});
			Jodit.plugins.remove('please');
		});

		it('should allow load plugin from external file', async () => {
			const editor = getJodit({
				extraPlugins: ['please'],
				removeButtons: ['changeCase'],
				buttons: [
					{
						group: 'font-style',
						buttons: []
					}
				]
			});
			await Jodit.plugins.wait('please');
			await editor.async.requestIdlePromise();
			expect(editor.toolbar.buttons.map(b => b.state.name)).deep.equals([
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'eraser',
				'test'
			]);
			expect(pleaseInited).is.true;
		});

		it('should not influence on the readiness of the editor', async () => {
			const editor = getJodit({
				extraPlugins: ['please'],
				buttons: [
					{
						group: 'font-style',
						buttons: []
					}
				]
			});
			expect(editor.isReady).is.true;
		});

		describe('Destruct Jodit before plugin loaded', () => {
			it('should do nothing', async () => {
				const editor = getJodit({
					extraPlugins: ['please'],
					buttons: [
						{
							group: 'font-style',
							buttons: []
						}
					]
				});

				editor.destruct();
				await delay(500);
				expect(pleaseInited).is.false;
			});
		});
	});
});
