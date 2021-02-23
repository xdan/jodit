/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Test object observer', function () {
	function getTestObject() {
		return {
			editable: true,
			disabled: false,
			some: {
				element: {
					enable: true,
					one: 1,
					two: 2
				}
			}
		};
	}

	const get = Jodit.modules.Helpers.get;
	const stringify = Jodit.modules.Helpers.stringify;
	const isEqual = Jodit.modules.Helpers.isEqual;

	const A = function (result, keyA, keyB) {
		function A() {
			this.jodit = getJodit();
			this.setStatus('ready');
		}

		function __() {
			this.constructor = A;
		}

		__.prototype = Jodit.modules.ViewComponent.prototype;
		A.prototype = new __();

		A.prototype.methodA = function () {
			result.push(['A', get(keyA, this)]);
		};

		A.prototype.methodB = function () {
			result.push(['B', get(keyB || keyA, this)]);
		};

		A.prototype.countCall = 0;
		A.prototype.countPromiseCall = 0;

		A.prototype.callTime = function () {
			this.countCall++;
		};

		A.prototype.callPromiseTime = function () {
			const that = this;
			this.countCall++;

			return new Promise(function (res) {
				setTimeout(function () {
					that.countPromiseCall++;
					res();
				}, 100);
			});
		};

		A.prototype.methodC = function (key, oldValue, newValue) {
			result.push(['C', oldValue, newValue]);
		};

		A.prototype.state = getTestObject();

		return A;
	};

	describe('Test debounce decorator', function () {
		it('Should call method only once in time', function (done) {
			const result = [],
				AClass = A(result, 'state.editable');

			Jodit.decorators.debounce(100)(AClass.prototype, 'callTime');

			const a = new AClass();

			a.callTime();
			expect(a.countCall).eq(0);
			a.callTime();
			expect(a.countCall).eq(0);
			a.callTime();
			expect(a.countCall).eq(0);

			setTimeout(() => {
				expect(a.countCall).eq(1);
				done();
			}, 500);
		});

		describe('Options', function () {
			it('Should call method only once in time', function (done) {
				const result = [],
					AClass = A(result, 'state.editable');

				Jodit.decorators.debounce({
					timeout: 100
				})(AClass.prototype, 'callTime');

				const a = new AClass();

				a.callTime();
				expect(a.countCall).eq(0);
				a.callTime();
				expect(a.countCall).eq(0);
				a.callTime();
				expect(a.countCall).eq(0);

				setTimeout(() => {
					expect(a.countCall).eq(1);
					done();
				}, 500);
			});
		});

		describe('Promisify debounce decorator', function () {
			it('Should call method only once in time', function (done) {
				unmockPromise();

				const result = [],
					AClass = A(result, 'state.editable');

				Jodit.decorators.debounce({
					timeout: 100,
					promisify: true
				})(AClass.prototype, 'callPromiseTime');

				const a = new AClass();

				let counter = 0;

				a.callPromiseTime().then(function () {
					counter++;
					expect(a.countPromiseCall).eq(1);
				});

				a.callPromiseTime().then(function () {
					counter++;
					expect(a.countPromiseCall).eq(1);
				});

				a.callPromiseTime().then(function () {
					counter++;
					expect(a.countPromiseCall).eq(1);
				});

				setTimeout(() => {
					expect(counter).eq(3);
					expect(a.countCall).eq(1);
					expect(a.countPromiseCall).eq(1);
					done();
				}, 500);
			});
		});
	});

	describe('Test watch decorator', function () {
		it('Should add watcher to whole field object', function () {
			const result = [],
				AClass = A(result, 'state.editable');

			Jodit.decorators.watch('state')(AClass.prototype, 'methodA');

			const a = new AClass();

			a.state = Object.assign({}, a.state, {
				editable: false
			});

			a.state = Object.assign({}, a.state, {
				editable: true
			});

			expect(result).to.deep.equal([
				['A', false],
				['A', true]
			]);
		});

		it('Should add watcher to some field in Component', function () {
			const result = [],
				AClass = A(result, 'state.some.element.enable');

			Jodit.decorators.watch('state.some.element.enable')(
				AClass.prototype,
				'methodA'
			);

			const a = new AClass();

			a.state.some.element.enable = false;
			a.state.some.element.enable = true;

			expect(result).to.deep.equal([
				['A', false],
				['A', true]
			]);
		});

		describe('Add several watchers', function () {
			describe('on same fields', function () {
				it('Should call all handlers', function () {
					const result = [],
						AClass = A(result, 'state.some.element.enable');

					Jodit.decorators.watch('state.some.element.enable')(
						AClass.prototype,
						'methodA'
					);

					Jodit.decorators.watch('state.some.element.enable')(
						AClass.prototype,
						'methodB'
					);

					const a = new AClass();

					a.state.some.element.enable = false;
					a.state.some.element.enable = true;

					expect(result).to.deep.equal([
						['A', false],
						['B', false],
						['A', true],
						['B', true]
					]);
				});
			});

			describe('on different fields', function () {
				it('Should call only matched handlers', function () {
					const result = [],
						AClass = A(
							result,
							'state.some.element.one',
							'state.some.element.two'
						);

					Jodit.decorators.watch('state.some.element.one')(
						AClass.prototype,
						'methodA'
					);

					Jodit.decorators.watch('state.some.element.two')(
						AClass.prototype,
						'methodB'
					);

					const a = new AClass();

					a.state.some.element.enable = false; // indifferent

					a.state.some.element.one = 2; // call methodA
					a.state.some.element.two = 3; // call methodB

					expect(result).to.deep.equal([
						['A', 2],
						['B', 3]
					]);
				});
			});
		});

		describe('On change field', function () {
			it('Should fire change all parent field', function () {
				const result = [],
					AClass = A(result, 'state.some.element.one');

				Jodit.decorators.watch('state.some')(
					AClass.prototype,
					'methodA'
				);

				const a = new AClass();

				a.state.some.element.one = 5;
				a.state.some.element.one = 15;
				a.state.some.element.one = 15;

				expect(result).to.deep.equal([
					['A', 5],
					['A', 15]
				]);
			});
			it('Should add in handler - old value as first argument', function () {
				const result = [],
					AClass = A(result, 'state.some.element.one');

				Jodit.decorators.watch('state.some')(
					AClass.prototype,
					'methodC'
				);

				const a = new AClass();

				a.state.some.element.one = 5;
				a.state.some.element.one = 15;

				expect(result).to.deep.equal([
					['C', 1, 5],
					['C', 5, 15]
				]);
			});
		});
	});

	describe('Test safe stringify', function () {
		it('Should safe stringify any circular object to string', function () {
			const a = {},
				b = getTestObject();

			expect(stringify(a)).equals('{}');

			expect(stringify(b)).equals(
				'{"editable":true,"disabled":false,"some":{"element":{"enable":true,"one":1,"two":2}}}'
			);

			b.b = b;
			expect(stringify(b)).equals(
				'{"editable":true,"disabled":false,"some":{"element":{"enable":true,"one":1,"two":2}},"b":"[refObject]"}'
			);
		});
	});

	describe('Test object properties', function () {
		describe('Observed object', function () {
			it('Should has only own object properties', function () {
				const a = { a: 1, b: 2 };
				const observed = Jodit.modules.ObserveObject.create(a);
				expect(Object.keys(observed)).deep.equals(Object.keys(a));
			});
		});
	});

	describe('Test equal checker', function () {
		describe('Two object', function () {
			describe('Check one object', function () {
				it('Should check that is one object', function () {
					const a = {},
						b = [];

					expect(isEqual(a, a)).is.true;
					expect(isEqual(b, b)).is.true;
					expect(isEqual(a, b)).is.false;
				});
			});

			describe('Check scalar value', function () {
				it('Should check normal', function () {
					expect(
						isEqual(
							function () {},
							function () {}
						)
					).is.true;

					expect(
						isEqual(
							function () {
								return 1;
							},
							function () {}
						)
					).is.false;

					expect(isEqual(1, 1)).is.true;
					expect(isEqual(1, 2)).is.false;
					expect(isEqual(true, true)).is.true;
					expect(isEqual(1.0, 1)).is.true;
					expect(isEqual('1', 1)).is.true;
				});
			});

			describe('Check array', function () {
				it('Should deep check', function () {
					expect(isEqual([1], [1])).is.true;
					expect(isEqual([1], [2])).is.false;
					expect(isEqual(['test'], ['test'])).is.true;
					expect(isEqual(['test'], ['test', 1])).is.false;
				});
			});

			describe('Check ref object', function () {
				it('Should deep check and add instead ref some const', function () {
					const a = getTestObject(),
						b = getTestObject();

					expect(isEqual(a, b)).is.true;

					a.b = b;
					b.b = a;

					expect(isEqual(a, b)).is.true;

					a.b = 1;
					b.b = 2;

					expect(isEqual(a, b)).is.false;

					expect(isEqual(window, document)).is.false;
				});
			});
		});
	});

	describe('Event on change', function () {
		it('Should fire event when field value was changed', function () {
			const counter = [];

			const data = Jodit.modules.ObserveObject.create(getTestObject());

			data.on('change', function (key) {
				counter.push(key);
			});

			data.editable = false;
			data.editable = false;

			data.some.element.two = 2;
			data.some.element.one = 2;

			expect(counter).to.deep.equal(['editable', 'some.element.one']);
		});

		describe('Key change event', function () {
			it('Should fire event.key when field value was changed', function () {
				const counter = [];

				const data = Jodit.modules.ObserveObject.create(
					getTestObject()
				);

				data.on('change.some.element.one', function (key) {
					counter.push(key);
				});

				data.editable = false;
				data.editable = false;

				data.some.element.two = 2;
				data.some.element.one = 2;

				expect(counter).to.deep.equal(['some.element.one']);
			});

			it('Should fire event with old and new Value', function () {
				const counter = [];

				const data = Jodit.modules.ObserveObject.create(
					getTestObject()
				);

				data.on(
					'change.some.element.one',
					function (key, oldValue, newValue) {
						counter.push(key, oldValue, newValue);
					}
				);

				data.some.element.one = 2;
				data.some.element.one = 3;

				expect(counter).to.deep.equal([
					'some.element.one',
					1,
					2,
					'some.element.one',
					2,
					3
				]);
			});
		});

		describe('Change watched property', function () {
			it('Should fire handler', function () {
				const counter = [],
					obj = {
						mode: 'top',
						methodA: function () {
							counter.push(obj.mode);
						}
					};

				Jodit.decorators.watch('mode')(obj, 'methodA');

				expect(obj.mode).equals('top');

				obj.mode = 'left';

				expect(obj.mode).equals('left');
				expect(obj.mode).equals('left');

				expect(counter).to.deep.equal(['left']);
			});
		});

		describe('Change whole branch', function () {
			it('Should fire event.key when field value was changed', function () {
				const counter = [];

				const data = Jodit.modules.ObserveObject.create(
					getTestObject()
				);

				data.on(
					['change.some.element.test', 'change.some'],
					function (key) {
						counter.push(key);
					}
				);

				data.some = {
					element: {
						test: 1
					}
				};

				data.some.element.test = 2;

				expect(counter).to.deep.equal([
					'some',
					'some.element.test',
					'some.element.test'
				]);
			});
		});
	});
});
