/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/* eslint-disable max-classes-per-file */

describe('Decorators', () => {
	describe('component', () => {
		let editor, A, B, DecoratedA, DecoratedB;

		const __extends = (function () {
			let extendStatics = function (d, b) {
				extendStatics =
					Object.setPrototypeOf ||
					({ __proto__: [] } instanceof Array &&
						function (d, b) {
							d.__proto__ = b;
						}) ||
					function (d, b) {
						for (var p in b)
							if (Object.prototype.hasOwnProperty.call(b, p))
								d[p] = b[p];
					};
				return extendStatics(d, b);
			};

			return function (d, b) {
				if (typeof b !== 'function' && b != null) {
					throw new TypeError(
						'Class extends value ' +
							String(b) +
							' is not a constructor or null'
					);
				}
				extendStatics(d, b);
				function __() {
					this.constructor = d;
				}
				d.prototype =
					b == null
						? Object.create(b)
						: ((__.prototype = b.prototype), new __());
			};
		})();

		const statuses = [];

		before(() => {
			editor = getJodit();
		});

		beforeEach(() => {
			if (Jodit.esNext) {
				A = class extends Jodit.modules.UIElement {
					className() {
						return 'A';
					}

					setStatus(status) {
						statuses.push(status + this.className());
						super.setStatus(status);
					}

					someHookReadyHandler() {
						statuses.push('run hook' + this.className());
					}
				};

				DecoratedA = Jodit.decorators.component(A);

				B = class extends DecoratedA {
					className() {
						return 'B';
					}
				};
			} else {
				A = (function (_super) {
					__extends(A, _super);

					function A() {
						return (
							(_super != null && _super.apply(this, arguments)) ||
							this
						);
					}

					A.prototype.className = function () {
						return 'A';
					};

					A.prototype.setStatus = function (status) {
						statuses.push(status + this.className());
						_super.prototype.setStatus.call(this, status);
					};

					A.prototype.someHookReadyHandler = function () {
						statuses.push('run hook' + this.className());
					};

					return A;
				})(Jodit.modules.UIElement);

				DecoratedA = Jodit.decorators.component(A);

				B = (function (_super) {
					__extends(B, _super);

					function B() {
						return (
							(_super != null && _super.apply(this, arguments)) ||
							this
						);
					}

					B.prototype.className = function () {
						return 'B';
					};
					return B;
				})(DecoratedA);
			}

			DecoratedB = Jodit.decorators.component(B);

			statuses.length = 0;
		});

		it('Should set ready status after new instance DecoratedA', () => {
			const a = new DecoratedA(editor);
			expect(a.componentStatus).eq('ready');
			expect(statuses).deep.eq(['readyA']);
		});

		it('Should not set ready status after new instance A', () => {
			const a = new A(editor);
			expect(a.componentStatus).eq('beforeInit');
			expect(statuses).deep.eq([]);
		});

		it('Should not set ready status after new instance B', () => {
			const b = new B(editor);
			expect(b.componentStatus).eq('beforeInit');
			expect(statuses).deep.eq([]);
		});

		it('Should run setStatus only for root constructor', () => {
			const b = new DecoratedB(editor);
			expect(b.componentStatus).eq('ready');
			expect(statuses).deep.eq(['readyB']);
		});

		it('Should run hooks(ready) for all children', () => {
			decorate(
				[Jodit.decorators.hook('ready')],
				A.prototype,
				'someHookReadyHandler'
			);
			const b = new DecoratedB(editor);
			expect(b.componentStatus).eq('ready');
			expect(statuses).deep.eq(['readyB', 'run hookB']);
		});

		describe('instanceof', () => {
			it('Should correct work with instanceof B', () => {
				const b = new DecoratedB(editor);
				expect(b instanceof B).is.true;
				expect(b instanceof DecoratedB).is.true;
				expect(b instanceof DecoratedA).is.true;
				expect(b instanceof A).is.true;
				expect(b instanceof Jodit.modules.UIElement).is.true;
			});

			it('Should correct work with instanceof A', () => {
				const a = new DecoratedA(editor);
				expect(a instanceof B).is.false;
				expect(a instanceof DecoratedB).is.false;
				expect(a instanceof DecoratedA).is.true;
				expect(a instanceof A).is.true;
				expect(a instanceof Jodit.modules.UIElement).is.true;
			});
		});
	});
});
