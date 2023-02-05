/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
('popup' in window.skipTest ? describe.skip : describe)(
	'Test popup',
	function () {
		const position = Jodit.modules.Helpers.position;

		let textBox;
		const elms = [];

		beforeEach(function () {
			textBox = document.createElement('div');
			Object.assign(textBox.style, {
				position: 'fixed',
				display: 'flex',
				flexWrap: 'wrap',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				background: 'red'
			});
			document.body.appendChild(textBox);

			for (let i = 0; i < 4; i += 1) {
				for (let j = 0; j < 4; j += 1) {
					const elmBox = document.createElement('div');

					Object.assign(elmBox.style, {
						width: '25%',
						height: '25%',
						background:
							'rgb(' +
							(i * 30 + 128) +
							',' +
							(j * 30 + 28) +
							', ' +
							(i * 10 + j * 10 + 100) +
							')'
					});

					textBox.appendChild(elmBox);
					elms.push(elmBox);
				}
			}
		});

		afterEach(function () {
			textBox && textBox.remove();
			elms.length = 0;
		});

		const aliases = {
			leftTop: function () {
				return elms[0];
			},
			rightTop: function () {
				return elms[3];
			},
			leftBottom: function () {
				return elms[12];
			},
			rightBottom: function () {
				return elms[15];
			},
			center: function () {
				return elms[5];
			}
		};

		const openPopup = function (getBound, content, strategy) {
			const editor = getJodit();

			const popup = new Jodit.modules.Popup(editor);

			if (strategy) {
				popup.strategy = strategy;
			}

			popup.setContent(content || 'Test content').open(getBound);

			return {
				left: parseInt(popup.container.style.left, 10),
				top: parseInt(popup.container.style.top, 10),
				width: popup.container.offsetWidth,
				height: popup.container.offsetHeight
			};
		};

		describe('Open popup on some target', function () {
			describe('Usual case - there is enough space under element', function () {
				it('should show popup under element', function () {
					const div = appendTestDiv();
					div.innerText = 'test';

					const gb = function () {
						return position(div);
					};

					const pos = openPopup(gb);

					expect(pos.left).equals(gb().left);
					expect(pos.top).equals(gb().top + gb().height);
				});
			});

			describe('Corners', function () {
				describe('Change default strategy', function () {
					it('should show popup to match the strategy', function () {
						const gb = function () {
							return position(aliases.center());
						};

						const pos = openPopup(gb, false, 'rightBottom');

						expect(pos.left + pos.width).equals(
							gb().left + gb().width
						);
						expect(pos.top).equals(gb().top + gb().height);
					});
				});

				describe('Left-Top', function () {
					it('should show popup under element', function () {
						const gb = function () {
							return position(aliases.leftTop());
						};

						const pos = openPopup(gb);

						expect(pos.left).equals(gb().left);
						expect(pos.top).equals(gb().top + gb().height);
					});
				});

				describe('Right-Top', function () {
					describe('Small popup', function () {
						it('should show popup under element', function () {
							const gb = function () {
								return position(aliases.rightTop());
							};

							const pos = openPopup(gb);

							expect(pos.left).equals(gb().left);
							expect(pos.top).equals(gb().top + gb().height);
						});
					});

					describe('Big popup', function () {
						it("should show popup under element but right corner should be under target's right-bottom corner", function () {
							const gb = function () {
								return position(aliases.rightTop());
							};

							const pos = openPopup(gb, 'testO'.repeat(30));

							expect(pos.left + pos.width).equals(
								gb().left + gb().width
							);
							expect(pos.top).equals(gb().top + gb().height);
						});
					});
				});

				describe('Left-Bottom', function () {
					describe('Small popup', function () {
						it('should show popup above element', function () {
							const gb = function () {
								return position(aliases.leftBottom());
							};

							const pos = openPopup(gb);

							expect(pos.left).equals(gb().left);
							expect(pos.top + pos.height).equals(gb().top);
						});
					});
				});

				describe('Right-Bottom', function () {
					describe('Small popup', function () {
						it('should show popup above element', function () {
							const gb = function () {
								return position(aliases.rightBottom());
							};

							const pos = openPopup(gb);

							expect(pos.left).equals(gb().left);
							expect(pos.top + pos.height).equals(gb().top);
						});
					});

					describe('Big popup', function () {
						it("should show popup above the element but right corner should be above target's right-top corner", function () {
							const gb = function () {
								return position(aliases.rightBottom());
							};

							const pos = openPopup(gb, 'testO'.repeat(30));

							expect(pos.left + pos.width).equals(
								gb().left + gb().width
							);
							expect(pos.top + pos.height).equals(gb().top);
						});
					});
				});
			});
		});
	}
);
