/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Font test', function () {
	describe('FontName', function () {
		describe('Open fontname list and select some element', function () {
			it('Should apply this font to current selection elements', function () {
				const editor = getJodit({
					toolbarAdaptive: false
				});

				editor.value = '<p>test</p>';
				editor.s.select(editor.editor.firstChild.firstChild);

				const openFontNameList = function () {
					clickTrigger('font', editor);

					const list = getOpenedPopup(editor);

					return Array.from(list.querySelectorAll('button')).slice(1);
				};

				expect(openFontNameList()).is.not.null;

				simulateEvent('mousedown', editor.editor);

				Array.from(openFontNameList()).map(function (font) {
					simulateEvent('click', font);

					const fontFamily = font
						.querySelector('span[style]')
						.getAttribute('data-style')
						.replace(/"/g, "'");

					expect(sortAttributes(editor.value)).equals(
						sortAttributes(
							`<p><span style="font-family:${fontFamily.replace(
								'!important',
								''
							)}">test</span></p>`
						)
					);
				});
			});

			describe('Extends standard font list', function () {
				it('Should standart font list elements', function () {
					const editor = getJodit({
						toolbarAdaptive: false,
						controls: {
							font: {
								list: {
									"-apple-system,BlinkMacSystemFont,'Segoe WPC','Segoe UI',HelveticaNeue-Light,Ubuntu,'Droid Sans',sans-serif":
										'OS System Font'
								}
							}
						}
					});

					editor.value = '<p>test</p>';
					editor.s.select(editor.editor.firstChild.firstChild);

					clickTrigger('font', editor);

					const list = getOpenedPopup(editor);

					expect(list).is.not.null;

					const buttons = list.querySelectorAll('button'),
						font = buttons[0];

					simulateEvent('click', font);

					expect(sortAttributes(editor.value)).equals(
						sortAttributes(
							"<p><span style=\"font-family:-apple-system,BlinkMacSystemFont,'Segoe WPC','Segoe UI',HelveticaNeue-Light,Ubuntu,'Droid Sans',sans-serif\">test</span></p>"
						)
					);
				});
			});
		});
	});

	describe('Change font-family and fomt-size in same time', function () {
		it('should save font-size after font-family', function () {
			const editor = getJodit();

			clickTrigger('fontsize', editor);
			const list = getOpenedPopup(editor);

			clickButton('10', list);
			editor.s.insertHTML('test');

			expect(editor.value).equals(
				'<p><span style="font-size: 10px;">test</span></p>'
			);

			clickTrigger('font', editor);
			const list2 = getOpenedPopup(editor);

			clickButton('impact_charcoal_sans_serif', list2);
			editor.s.insertHTML('stop');

			expect(sortAttributes(editor.value)).equals(
				'<p><span style="font-size:10px">test' +
					'<span style="font-family:impact,charcoal,sans-serif">stop</span></span></p>'
			);
		});
	});

	['pt', 'px'].forEach(function (point) {
		describe('Font size:' + point, function () {
			describe('State', function () {
				describe('First click on the button', function () {
					it('Should open list', function () {
						const editor = getJodit({
							defaultFontSizePoints: point
						});

						clickButton('fontsize', editor);

						const popup = getOpenedPopup(editor);

						expect(popup).is.not.null;
					});

					describe('Second click on the button', function () {
						it('Should apply previous choice', function () {
							const editor = getJodit({
								defaultFontSizePoints: point
							});

							editor.value = 'text2text';

							const range = editor.s.createRange(true);

							range.setStart(
								editor.editor.firstChild.firstChild,
								3
							);
							range.setEnd(
								editor.editor.firstChild.firstChild,
								6
							);

							clickButton('fontsize', editor);

							const popup = getOpenedPopup(editor);

							expect(popup).is.not.null;

							clickButton('8', popup);

							expect(sortAttributes(editor.value)).equals(
								`<p>tex<span style="font-size:8${point}">t2t</span>ext</p>`
							);

							const range2 = editor.s.createRange(true);

							range2.setStartAfter(editor.editor.firstChild);

							clickButton('fontsize', editor);

							const popup2 = getOpenedPopup(editor);

							expect(popup2).is.null;

							expect(editor.value).equals(
								`<p>tex<span style="font-size: 8${point};">t2t</span>ext</p><p><span style="font-size: 8${point};"></span></p>`
							);
						});
					});
				});
			});
		});
	});

	describe('Font family', function () {
		describe('State', function () {
			describe('First click on the button', function () {
				it('Should open list', function () {
					const editor = getJodit();

					clickButton('font', editor);

					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;
				});

				describe('Second click on the button', function () {
					it('Should apply previous choice', function () {
						const editor = getJodit();

						editor.value = 'text2text';

						const range = editor.s.createRange(true);

						range.setStart(editor.editor.firstChild.firstChild, 3);
						range.setEnd(editor.editor.firstChild.firstChild, 6);

						clickButton('font', editor);

						const popup = getOpenedPopup(editor);

						expect(popup).is.not.null;

						clickButton('impact_charcoal_sans_serif', popup);

						expect(editor.value).equals(
							'<p>tex<span style="font-family: impact, charcoal, sans-serif;">t2t</span>ext</p>'
						);

						const range2 = editor.s.createRange(true);

						range2.setStartAfter(editor.editor.firstChild);

						clickButton('font', editor);

						const popup2 = getOpenedPopup(editor);

						expect(popup2).is.null;

						expect(editor.value).equals(
							'<p>tex<span style="font-family: impact, charcoal, sans-serif;">t2t</span>ext</p><p><span style="font-family: impact, charcoal, sans-serif;"></span></p>'
						);
					});
				});
			});
		});
	});

	describe('Active', function () {
		describe('In list', function () {
			describe('Fontsize button', function () {
				it('Should be activated then element has some style value', function () {
					const editor = getJodit({
						history: {
							timeout: 0
						}
					});

					editor.value =
						'<p>test<span style="font-size: 12px">bold</span></p>';
					editor.s.focus();

					const p = editor.editor.firstChild;
					const font = getButton('fontsize', editor);

					expect(font).is.not.null;

					editor.s.setCursorAfter(p.firstChild);
					simulateEvent('mousedown', p);

					expect(font.getAttribute('aria-pressed')).equals('false');

					editor.s.setCursorIn(p.lastChild);

					simulateEvent('mousedown', p);

					clickTrigger('fontsize', editor);

					const font12 = getOpenedPopup(editor).querySelector(
						'[role="listitem"][class*="12"]'
					);

					expect(font12.getAttribute('aria-pressed')).equals('true');
				});
			});

			describe('Font family button', function () {
				it('Should be activated then element has some style value', function () {
					const editor = getJodit({
						toolbarAdaptive: false,
						history: {
							timeout: 0
						}
					});

					editor.value =
						'<p>test<span style="font-family: georgia,palatino,serif;">bold</span></p>';
					editor.s.focus();

					const p = editor.editor.firstChild;
					const font = getButton('font', editor);

					expect(font).is.not.null;

					editor.s.setCursorAfter(p.firstChild);
					simulateEvent('mousedown', p);
					expect(font.getAttribute('aria-pressed')).equals('false');

					editor.s.setCursorIn(p.lastChild);

					simulateEvent('mousedown', 0, p);

					clickTrigger('font', editor);

					const popup = getOpenedPopup(editor);

					const fontGeorgia = popup.querySelector(
						'[class*=georgia_palatino]'
					);

					expect(fontGeorgia).does.not.equal(font);
					expect(fontGeorgia.hasAttribute('aria-pressed')).is.true;
				});
			});
		});
	});
});
