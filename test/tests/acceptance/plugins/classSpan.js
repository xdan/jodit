/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('classSpan test', function () {
	describe('Open className list and select some element', function () {
		it('Should apply this className to current selection elements', function () {
			const editor = getJodit({
				toolbarAdaptive: false,
				controls: {
					classSpan: {
						list: {
							class1: 'Classe 1',
							class2: 'Classe 2',
							class3: 'Classe 3',
							class4: 'Classe 4',
							class5: 'Classe 5'
						}
					}
				}
			});

			const openClassNameList = function () {
				clickTrigger('classSpan', editor);

				const list = getOpenedPopup(editor);

				return Array.from(list.querySelectorAll('button')).slice(1);
			};

			expect(openClassNameList()).is.not.null;

			Array.from(openClassNameList()).map(function (classNames) {
				editor.value = '<p>test</p>';
				editor.s.select(editor.editor.firstChild.firstChild);

				simulateEvent('click', 0, classNames);

				const className = classNames
					.querySelector('span[class=jodit-toolbar-button__text]')
					.querySelector('span[class]')
					.getAttribute('class');

				expect(sortAttributes(editor.value)).equals(
					sortAttributes(
						'<p><span class="' + className + '">test</span></p>'
					)
				);
			});
		});

		describe('Extends standard classname list', function () {
			it('Should standart classname list elements', function () {
				const editor = getJodit({
					toolbarAdaptive: false,
					controls: {
						classSpan: {
							list: {
								foo: 'bar'
							}
						}
					}
				});

				editor.value = '<p>test</p>';
				editor.s.select(editor.editor.firstChild.firstChild);

				clickTrigger('classSpan', editor);

				const list = getOpenedPopup(editor);

				expect(list).is.not.null;

				const buttons = list.querySelectorAll('button'),
					className = buttons[buttons.length - 1];
				simulateEvent('click', 0, className);

				expect(sortAttributes(editor.value)).equals(
					sortAttributes('<p><span class="foo">test</span></p>')
				);
			});
		});
	});

	describe('ClassName', function () {
		describe('State', function () {
			describe('First click on the button', function () {
				it('Should open list', function () {
					const editor = getJodit({
						toolbarAdaptive: false,
						controls: {
							classSpan: {
								list: {
									class1: 'Classe 1',
									class2: 'Classe 2',
									class3: 'Classe 3',
									class4: 'Classe 4',
									class5: 'Classe 5'
								}
							}
						}
					});

					clickButton('classSpan', editor);

					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;
				});

				describe('Second click on the button', function () {
					it('Should apply previous choice', function () {
						const editor = getJodit({
							toolbarAdaptive: false,
							controls: {
								classSpan: {
									list: {
										class1: 'Classe 1',
										class2: 'Classe 2',
										class3: 'Classe 3',
										class4: 'Classe 4',
										class5: 'Classe 5'
									}
								}
							}
						});

						editor.value = 'text2text';

						const range = editor.s.createRange(true);

						range.setStart(editor.editor.firstChild.firstChild, 3);
						range.setEnd(editor.editor.firstChild.firstChild, 6);

						clickButton('classSpan', editor);

						const popup = getOpenedPopup(editor);

						expect(popup).is.not.null;

						clickButton('class3', popup);

						expect(editor.value).equals(
							'<p>tex<span class="class3">t2t</span>ext</p>'
						);

						const range2 = editor.s.createRange(true);

						range2.setStartAfter(editor.editor.firstChild);

						clickButton('classSpan', editor);

						const popup2 = getOpenedPopup(editor);

						expect(popup2).is.null;

						expect(editor.value).equals(
							'<p>tex<span class="class3">t2t</span>ext</p><p><span class="class3"></span></p>'
						);
					});
				});
			});
		});
	});

	describe('Active', function () {
		describe('In list', function () {
			describe('ClassSpan button', function () {
				it('Should be activated then element has some className', function () {
					const editor = getJodit({
						toolbarAdaptive: false,
						observer: {
							timeout: 0
						},
						controls: {
							classSpan: {
								list: {
									class1: 'Classe 1',
									class2: 'Classe 2',
									class3: 'Classe 3',
									class4: 'Classe 4',
									class5: 'Classe 5'
								}
							}
						}
					});

					editor.value =
						'<p>test<span class="class3">bold</span></p>';
					editor.s.focus();

					const p = editor.editor.firstChild;
					const className = getButton('classSpan', editor);

					expect(className).is.not.null;

					editor.s.setCursorAfter(p.firstChild);
					simulateEvent('mousedown', 0, p);
					expect(className.getAttribute('aria-pressed')).equals(
						'false'
					);

					editor.s.setCursorIn(p.lastChild);

					simulateEvent('mousedown', 0, p);

					clickTrigger('classSpan', editor);

					const popup = getOpenedPopup(editor);

					const class3 = popup.querySelector('[class*=class3]');

					expect(class3).does.not.equal(className);
					expect(class3.hasAttribute('aria-pressed')).is.true;
				});
			});
		});
	});
});
