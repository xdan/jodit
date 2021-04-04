/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
					editor.value = '<ul><li>test</li></ul>';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						4
					);
					range.collapse(true);

					sel.removeAllRanges();
					sel.addRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(editor.value).equals(
						'<ul><li>test</li><li> a <br></li></ul>'
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
					editor.value = 'Hello world';
					editor.s.select(editor.editor.firstChild);

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
				it('Should not do anything', function () {
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

					editor.value = '<p>Text to text</p>';

					const range = editor.s.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 0);
					range.collapse(true);
					editor.s.selectRange(range);

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

					editor.value = '<p>Text to text</p>';

					const range = editor.s.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 0);
					range.collapse(true);
					editor.s.selectRange(range);

					clickTrigger('ul', editor);
					clickButton('circle', getOpenedPopup(editor));

					editor.s.insertHTML('test ');

					expect(sortAttributes(editor.value)).equals(
						'<ul style="list-style-type:circle"><li>test Text to text</li></ul>'
					);
				});
			});

			describe('Click on same element inside popup two times', function () {
				it('should return ul to first state', function () {
					const editor = getJodit();

					editor.value = '<p>Text to text</p>';

					const range = editor.s.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 0);
					range.collapse(true);
					editor.s.selectRange(range);

					clickTrigger('ul', editor);
					clickButton(
						'circle',
						document.querySelector(
							'[role="popup"][data-editor_id="' + editor.id + '"]'
						)
					);

					expect(sortAttributes(editor.value)).equals(
						'<ul style="list-style-type:circle"><li>Text to text</li></ul>'
					);

					clickTrigger('ul', editor);
					clickButton(
						'circle',
						document.querySelector(
							'[role="popup"][data-editor_id="' + editor.id + '"]'
						)
					);

					editor.s.insertHTML('test ');

					expect(
						sortAttributes(editor.value).replace(/<br>/, '')
					).equals('<p>test Text to text</p>');
				});
			});
		});
	});
});
