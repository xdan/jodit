/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test orderedList plugin', () => {
	describe('Commands', () => {
		describe('Unordered', () => {
			describe('insertUnorderedList', () => {
				it('Run command insertUnorderedList should wrap or replace all paragraphs and headings to ul>li', () => {
					const editor = getJodit();
					editor.value = '<h1>test</h1><h2>test</h2><p>test</p>';

					editor.execCommand('selectAll');
					editor.execCommand('insertUnorderedList');

					expect(editor.value).equals(
						'<ul><li>test</li><li>test</li><li>test</li></ul>'
					);
				});

				it('If press Enter inside <li> in the end it should create new <li> and cursor must be in it', () => {
					const editor = getJodit();
					editor.value = '<ul><li>test|</li></ul>';
					setCursorToChar(editor);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(editor.value).equals(
						'<ul><li>test</li><li> a </li></ul>'
					);
				});

				describe('Press Enter inside <li> inside some text', () => {
					it('should split that text and created new <li> and cursor must be in it', () => {
						const editor = getJodit();
						editor.value = '<ul><li>te|st</li></ul>';
						setCursorToChar(editor);

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);

						editor.s.insertNode(editor.createInside.text(' a '));

						expect(editor.value).equals(
							'<ul><li>te</li><li> a st</li></ul>'
						);
					});
				});
			});

			describe('Exec command on selected text', () => {
				it('Should wrap this text in ul/li', () => {
					const editor = getJodit();
					editor.value = 'Hello world';
					editor.s.select(editor.editor.firstChild);

					editor.execCommand('insertUnorderedList');

					expect(editor.value).equals(
						'<ul><li>Hello world</li></ul>'
					);
				});
			});

			describe('Exec command on collapsed cursor', () => {
				it('Should wrap whole text in ul/li', () => {
					const editor = getJodit();
					editor.value = 'Hello world';
					editor.s.setCursorAfter(
						editor.editor.firstChild.firstChild
					);

					editor.execCommand('insertUnorderedList');

					expect(editor.value).equals(
						'<ul><li>Hello world</li></ul>'
					);
				});
			});

			describe('With second argument', () => {
				it('Should wrap this text in styled ul/li', () => {
					const editor = getJodit();
					editor.value = '<p>|Hello world|</p>';
					setCursorToChar(editor);

					editor.execCommand('insertUnorderedList', false, 'circle');

					expect(sortAttributes(editor.value)).equals(
						'<ul style="list-style-type:circle"><li>Hello world</li></ul>'
					);
				});
			});
		});

		describe('Ordered', () => {
			describe('Exec command on selected text', () => {
				it('Should wrap this text inside ol/li', () => {
					const editor = getJodit();
					editor.value = 'Hello world';
					editor.s.select(editor.editor.firstChild);

					editor.execCommand('insertOrderedList');

					expect(editor.value).equals(
						'<ol><li>Hello world</li></ol>'
					);
				});
			});
		});

		describe('Run second time', () => {
			describe('On same place', () => {
				it('Should unwrap source elements', () => {
					const editor = getJodit();
					editor.value = '<p>test</p>';
					editor.s.setCursorIn(editor.editor.firstChild);

					clickButton('ul', editor);

					expect(editor.value.replace(/<br>/, '')).equals(
						'<ul><li>test</li></ul>'
					);

					clickButton('ul', editor);

					expect(editor.value.replace(/<br>/, '')).equals(
						'<p>test</p>'
					);
				});
			});

			describe('For several paragraphs', () => {
				it('Should return all elements', () => {
					const editor = getJodit();
					editor.value = '<p>|test</p><p>order</p><p>list|</p>';
					setCursorToChar(editor);

					clickButton('ul', editor);

					expect(editor.value.replace(/<br>/g, '')).equals(
						'<ul><li>test</li><li>order</li><li>list</li></ul>'
					);

					clickButton('ul', editor);

					expect(editor.value.replace(/<br>/g, '')).equals(
						'<p>test</p><p>order</p><p>list</p>'
					);
				});
			});

			describe('Unordered after Unordered', () => {
				it('Should unwrap selected ul/li', () => {
					const editor = getJodit();
					editor.value = '<ul><li>Hello world</li></ul>';
					editor.s.select(editor.editor.firstChild);

					editor.execCommand('insertUnorderedList');

					expect(editor.value.replace(/<br>/, '')).equals(
						'<p>Hello world</p>'
					);
				});
			});

			describe('Ordered after Unordered', () => {
				it('Should replace selected ul/li to ol/li', () => {
					const editor = getJodit();
					editor.value = '<ul><li>Hello world</li></ul>';
					editor.s.select(editor.editor.firstChild);

					editor.execCommand('insertOrderedList');

					expect(editor.value).equals(
						'<ol><li>Hello world</li></ol>'
					);
				});
			});

			describe('With another second argument', () => {
				it('Should change style.listStyleType', () => {
					const editor = getJodit();
					editor.value =
						'<ul style="list-style-type: circle"><li>Hello world</li></ul>';
					editor.s.select(editor.editor.firstChild);

					editor.execCommand('insertUnorderedList', false, 'square');

					expect(sortAttributes(editor.value)).equals(
						'<ul style="list-style-type:square"><li>Hello world</li></ul>'
					);
				});
			});
		});
	});

	describe('UI', () => {
		describe('Click on unordered list button', () => {
			describe('when selection is collapsed', () => {
				it('should wrap current box in new <ul><li> element', () => {
					const editor = getJodit();

					editor.value = '<p>|Text to text</p>';

					setCursorToChar(editor);

					clickButton('ul', editor);

					editor.s.insertHTML('test ');

					expect(editor.value).equals(
						'<ul><li>test Text to text</li></ul>'
					);
				});
			});

			describe('when selection is not collapsed', () => {
				let editor;
				beforeEach(() => {
					editor = getJodit({
						enter: 'BR',
						disablePlugins: ['wrap-nodes', 'add-new-line', 'enter'],
						buttons: ['ul', 'ol']
					});

					editor.value = '|test<br>Text|<br>to text';
					setCursorToChar(editor);
				});

				describe('Enter mode: BR', () => {
					it('Should wrap selected text in new <ul><li> element', () => {
						clickButton('ul', editor);
						expect(sortAttributes(editor.value)).equals(
							'<ul><li>test<br>Text</li></ul><br>to text'
						);
					});

					describe('Click second time', () => {
						it('Should unwrap selected text', () => {
							editor.value =
								'<ul><li>|test<br>Text|</li></ul><br>to text';
							setCursorToChar(editor);
							clickButton('ul', editor);
							expect(sortAttributes(editor.value)).equals(
								'test<br>Text<br>to text'
							);
						});
					});
				});
			});
		});

		describe('Click on trigger and click on some element', () => {
			describe('when selection is collapsed', () => {
				it('should wrap current box in new <ul><li> element with list-style-type', () => {
					const editor = getJodit();

					editor.value = '<p>|Text to text</p>';
					setCursorToChar(editor);

					clickTrigger('ul', editor);
					clickButton('circle', getOpenedPopup(editor));

					editor.s.insertHTML('test ');

					expect(sortAttributes(editor.value)).equals(
						'<ul style="list-style-type:circle"><li>test Text to text</li></ul>'
					);
				});

				describe('click on default after this', () => {
					it('should remove extra list style', () => {
						const editor = getJodit();

						editor.value = '<p>|Text to text</p>';
						setCursorToChar(editor);

						clickTrigger('ul', editor);
						clickButton('circle', getOpenedPopup(editor));

						expect(sortAttributes(editor.value)).equals(
							'<ul style="list-style-type:circle"><li>Text to text</li></ul>'
						);

						clickTrigger('ul', editor);
						clickButton('default', getOpenedPopup(editor));
						expect(getOpenedPopup(editor)).is.null;

						replaceCursorToChar(editor);
						expect(sortAttributes(editor.value)).equals(
							'<ul><li>|Text to text</li></ul>'
						);
					});
				});
			});

			describe('Click on same element inside popup two times', () => {
				it('should return ul to first state', () => {
					const editor = getJodit();

					editor.value = '<p>|Text to text</p>';
					setCursorToChar(editor);

					clickTrigger('ul', editor);
					clickButton('circle', getOpenedPopup(editor));

					expect(sortAttributes(editor.value)).equals(
						'<ul style="list-style-type:circle"><li>Text to text</li></ul>'
					);

					clickTrigger('ul', editor);
					clickButton('circle', getOpenedPopup(editor));

					editor.s.insertHTML('test ');

					expect(
						sortAttributes(editor.value).replace(/<br>/, '')
					).equals('<p>test Text to text</p>');
				});
			});
		});
	});
});
