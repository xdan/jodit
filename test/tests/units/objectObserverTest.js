describe('Test object observer', function() {
	function getTestObject() {
		return {
			editable: true,
			disabled: false,
			some: {
				element: {
					one: 1,
					two: 2
				}
			}
		};
	}

	const stringify = Jodit.modules.Helpers.stringify;
	const isEqual = Jodit.modules.Helpers.isEqual;

	describe('Test safe stringify', function() {
		it('Should safe stringify any circular object to string', function() {
			const a = {},
				b = getTestObject();

			expect(stringify(a)).equals('{}');

			expect(stringify(b)).equals(
				'{"editable":true,"disabled":false,"some":{"element":{"one":1,"two":2}}}'
			);

			b.b = b;
			expect(stringify(b)).equals(
				'{"editable":true,"disabled":false,"some":{"element":{"one":1,"two":2}},"b":"[refObject]"}'
			);
		});
	});

	describe('Test equal checker', function() {
		describe('Two object', function() {
			describe('Check one object', function() {
				it('Should check that is one object', function() {
					const a = {},
						b = [];

					expect(isEqual(a, a)).is.true;
					expect(isEqual(b, b)).is.true;
					expect(isEqual(a, b)).is.false;
				});
			});

			describe('Check scalar value', function() {
				it('Should check normal', function() {
					expect(
						isEqual(
							function() {},
							function() {}
						)
					).is.true;

					expect(
						isEqual(
							function() {
								return 1;
							},
							function() {}
						)
					).is.false;

					expect(isEqual(1, 1)).is.true;
					expect(isEqual(1, 2)).is.false;
					expect(isEqual(true, true)).is.true;
					expect(isEqual(1.0, 1)).is.true;
					expect(isEqual('1', 1)).is.true;
				});
			});

			describe('Check array', function() {
				it('Should deep check', function() {
					expect(isEqual([1], [1])).is.true;
					expect(isEqual([1], [2])).is.false;
					expect(isEqual(['test'], ['test'])).is.true;
					expect(isEqual(['test'], ['test', 1])).is.false;
				});
			});

			describe('Check ref object', function() {
				it('Should deep check and add instead ref some const', function() {
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

	describe('Event on change', function() {
		it('Should fire event when field value was changed', function() {
			const counter = [];

			const data = Jodit.modules.ObserveObject.create(getTestObject());

			data.on('change', function(key) {
				counter.push(key);
			});

			data.editable = false;
			data.editable = false;

			data.some.element.two = 2;
			data.some.element.one = 2;

			expect(counter).to.deep.equal(['editable', 'some.element.one']);
		});

		describe('Key change event', function() {
			it('Should fire event.key when field value was changed', function() {
				const counter = [];

				const data = Jodit.modules.ObserveObject.create(
					getTestObject()
				);

				data.on('change.some.element.one', function(key) {
					counter.push(key);
				});

				data.editable = false;
				data.editable = false;

				data.some.element.two = 2;
				data.some.element.one = 2;

				expect(counter).to.deep.equal(['some.element.one']);
			});
		});

		describe('Change whole branch', function() {
			it('Should fire event.key when field value was changed', function() {
				const counter = [];

				const data = Jodit.modules.ObserveObject.create(
					getTestObject()
				);

				data.on(['change.some.element.test', 'change.some'], function(
					key
				) {
					counter.push(key);
				});

				data.some = {
					element: {
						test: 1
					}
				};

				data.some.element.test = 2;

				expect(counter).to.deep.equal(['some', 'some.element.test']);
			});
		});
	});
});
