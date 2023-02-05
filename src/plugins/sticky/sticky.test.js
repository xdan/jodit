/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Sticky plugin', function () {
	describe('Without scrolling', function () {
		it('Should not have `jodit_sticky` class and toolbar must be in normal state', function () {
			const area = appendTestArea(),
				editor = new Jodit(area);

			editor.value = '<p>stop</p>'.repeat(100);
			expect(false).equals(
				editor.container.classList.contains('jodit_sticky')
			);
		});
	});

	describe('Create editor in page with long text', function () {
		describe('and scroll page to bottom', function () {
			it('Should add to editor class `jodit_sticky` and toolbar must be always on the top', function () {
				const editor = getJodit();

				editor.value = '<p>stop</p>'.repeat(100);

				const offset = Jodit.modules.Helpers.offset(
					editor.container,
					editor,
					editor.ownerDocument
				);

				window.scroll(0, offset.top + offset.height / 2); // scroll page to bottom

				simulateEvent('scroll', 0, window);

				expect(true).equals(
					editor.container.classList.contains('jodit_sticky')
				);

				expect(0).equals(
					editor.toolbar.container.getBoundingClientRect().top
				);
			});

			describe('On mobile devices - with toolbarDisableStickyForMobile = true', function () {
				it('Should not add to editor class `jodit_sticky`', function () {
					getBox().style.width = '370px'; // IPhone 7

					const area = appendTestArea(),
						editor = new Jodit(area);

					editor.value = '<p>stop</p>'.repeat(100);
					const offset = Jodit.modules.Helpers.offset(
						editor.container,
						editor,
						editor.ownerDocument
					);

					window.scroll(0, offset.top + offset.height / 2); // scroll page to bottom
					simulateEvent('scroll', 0, window);

					expect(false).equals(
						editor.container.classList.contains('jodit_sticky')
					);
					expect(0).does.not.equal(
						editor.toolbar.container.getBoundingClientRect().top
					);
					getBox().style.width = 'auto'; // IPhone 7
				});
			});

			describe('In iframe mode', function () {
				it('Should work some way', function () {
					const editor = getJodit({
						iframe: true
					});

					editor.value = '<p>stop</p>'.repeat(100);
					const offset = Jodit.modules.Helpers.offset(
						editor.container,
						editor,
						editor.ownerDocument
					);

					window.scroll(0, offset.top + offset.height / 2); // scroll page to bottom
					simulateEvent('scroll', 0, window);

					expect(true).equals(
						editor.container.classList.contains('jodit_sticky')
					);
					expect(0).equals(
						editor.toolbar.container.getBoundingClientRect().top
					);
				});
			});

			describe('add offset for toolbar', function () {
				it('Should add offset for sticky toolbar', function () {
					const area = appendTestArea(),
						editor = new Jodit(area, {
							toolbarStickyOffset: 100
						});

					editor.value = '<p>stop</p>'.repeat(100);
					const offset = Jodit.modules.Helpers.offset(
						editor.container,
						editor,
						editor.ownerDocument
					);

					window.scroll(0, offset.top + offset.height / 2); // scroll page to bottom
					simulateEvent('scroll', 0, window);

					expect(true).equals(
						editor.container.classList.contains('jodit_sticky')
					);
					expect(100).equals(
						editor.toolbar.container.getBoundingClientRect().top
					);
				});
			});

			describe('with toolbarSticky false', function () {
				it('Should do nothing with toolbar', function () {
					const area = appendTestArea(),
						editor = new Jodit(area, {
							toolbarStickyOffset: 100,
							toolbarSticky: false
						});

					editor.value = '<p>stop</p>'.repeat(100);
					const offset = Jodit.modules.Helpers.offset(
						editor.container,
						editor,
						editor.ownerDocument
					);

					window.scroll(0, offset.top + offset.height / 2); // scroll page to bottom
					simulateEvent('scroll', 0, window);

					expect(false).equals(
						editor.container.classList.contains('jodit_sticky')
					);
					expect(100).does.not.equal(
						editor.toolbar.container.getBoundingClientRect().top
					);
					expect(0).does.not.equal(
						editor.toolbar.container.getBoundingClientRect().top
					);
				});
			});
		});

		describe('and scroll page to the top', function () {
			it('Should remove class `jodit_sticky` from editor and toolbar must have normal position', function () {
				fillBoxBr(100);

				const area = appendTestArea(),
					editor = new Jodit(area),
					brs = [0, 0, 0, 0, 0, 0, 0, 0, 0].map(function () {
						return editor.ownerDocument.createElement('br');
					});

				brs.forEach(function (br) {
					editor.container.parentNode.insertBefore(
						br,
						editor.container
					);
				});

				editor.value = '<p>stop</p>'.repeat(100);
				const offset = Jodit.modules.Helpers.offset(
					editor.container,
					editor,
					editor.ownerDocument
				);

				window.scroll(0, offset.top - 200); // scroll page above editor
				simulateEvent('scroll', 0, window);

				expect(false).equals(
					editor.container.classList.contains('jodit_sticky')
				);

				expect(5).to.be.above(
					Math.abs(
						200 -
							Jodit.modules.Helpers.position(
								editor.toolbar.container
							).top
					)
				);

				brs.forEach(function (br) {
					br.parentNode.removeChild(br);
				});
			});
		});
	});
});
