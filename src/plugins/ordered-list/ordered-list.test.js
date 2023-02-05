/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test orderedList plugin', function () {
	describe('Commands', function () {
		describe('Unordered', function () {
			describe('insertUnorderedList', function () {
				it('Run command insertUnorderedList should wrap or replace all paragraphs and headings to ul>li', function () {
					const editor = getJodit();
					editor.value = '<h1>test</h1><h2>test</h2><p>test</p>';

					editor.execCommand('selectAll');
					editor.execCommand('insertUnorderedList');

					expect(editor.value).equals(
						'<ul><li>test</li><li>test</li><li>test</li></ul>'
					);
				});

				it('If press Enter inside <li> in the end it should create new <li> and cursor must be in it', function () {
					const editor = getJodit();
					editor.value = '<ul><li>test|</li></ul>';
					setCursorToChar(editor);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(editor.value).equals(
						'<ul><li>test</li><li> a </li></ul>'
					);
				});

				it('If press Enter inside <li> inside some text should split that text and created new <li> and cursor must be in it', function () {
					const editor = getJodit();
					editor.value = '<ul><li>test</li></ul>';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						2
					);
					range.collapse(true);

					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(editor.value).equals(
						'<ul><li>te</li><li> a st</li></ul>'
					);
				});
			});

			describe('Exec command on selected text', function () {
				it('Should wrap this text in ul/li', function () {
					const editor = getJodit();
					editor.value = 'Hello world';
					editor.s.select(editor.editor.firstChild);

					editor.execCommand('insertUnorderedList');

					expect(editor.value).equals(
						'<ul><li>Hello world</li></ul>'
					);
				});
			});

			describe('Exec command on collapsed cursor', function () {
				it('Should wrap whole text in ul/li', function () {
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

			describe('With second argument', function () {
				it('Should wrap this text in styled ul/li', function () {
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

		describe('Ordered', function () {
			describe('Exec command on selected text', function () {
				it('Should wrap this text inside ol/li', function () {
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

		describe('Run second time', function () {
			describe('On same place', function () {
				it('Should unwrap source elements', function () {
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

			describe('Unordered after Unordered', function () {
				it('Should unwrap selected ul/li', function () {
					const editor = getJodit();
					editor.value = '<ul><li>Hello world</li></ul>';
					editor.s.select(editor.editor.firstChild);

					editor.execCommand('insertUnorderedList');

					expect(editor.value.replace(/<br>/, '')).equals(
						'<p>Hello world</p>'
					);
				});
			});

			describe('Ordered after Unordered', function () {
				it('Should replace selected ul/li to ol/li', function () {
					const editor = getJodit();
					editor.value = '<ul><li>Hello world</li></ul>';
					editor.s.select(editor.editor.firstChild);

					editor.execCommand('insertOrderedList');

					expect(editor.value).equals(
						'<ol><li>Hello world</li></ol>'
					);
				});
			});

			describe('With another second argument', function () {
				it('Should change style.listStyleType', function () {
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

	describe('UI', function () {
		describe('Click on unordered list button', function () {
			describe('when selection is collapsed', function () {
				it('should wrap current box in new <ul><li> element', function () {
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
		});

		describe('Click on trigger and click on some element', function () {
			describe('when selection is collapsed', function () {
				it('should wrap current box in new <ul><li> element with list-style-type', function () {
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

				describe('click on default after this', function () {
					it('should remove extra list style', function () {
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

			describe('Click on same element inside popup two times', function () {
				it('should return ul to first state', function () {
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
