/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Hotkeys', function () {
	describe('Override default shortcuts for some commands', function () {
		it('Should work default shortcuts for another commands', function () {
			const area = appendTestArea(),
				editor = new Jodit(area, {
					commandToHotkeys: {
						bold: 'ctrl+shift+b',
						italic: ['ctrl+i', 'ctrl+shift+i']
					}
				});

			editor.value = 'test test test';

			const range = editor.s.createRange(true);
			range.setStart(editor.editor.firstChild.firstChild, 4);
			range.setEnd(editor.editor.firstChild.firstChild, 8);

			// standart ctrl+u
			simulateEvent('keydown', 85, editor.editor, function (data) {
				// data.shiftKey = true;
				data.ctrlKey = true;
			});

			expect(editor.value).equals('<p>test<u> tes</u>t test</p>');
		});
		describe('Replace ctrl+b to ctrl+shift+b for bold command', function () {
			it('Should not execute bold on ctrl+b', function () {
				const area = appendTestArea(),
					editor = new Jodit(area, {
						commandToHotkeys: {
							bold: 'ctrl+shift+b',
							italic: ['ctrl+i', 'ctrl+shift+i']
						}
					});

				editor.value = 'test test test';

				const range = editor.s.createRange(true);
				range.setStart(editor.editor.firstChild.firstChild, 4);
				range.setEnd(editor.editor.firstChild.firstChild, 8);

				// standart ctrl+b
				simulateEvent('keydown', 66, editor.editor, function (data) {
					// data.shiftKey = true;
					data.ctrlKey = true;
				});

				expect(editor.value).equals('<p>test test test</p>'); // should not sork

				simulateEvent('keydown', 66, editor.editor, function (data) {
					data.shiftKey = true;
					data.ctrlKey = true;
				});

				expect(editor.value).equals(
					'<p>test<strong> tes</strong>t test</p>'
				);
			});

			it('Should execute bold on ctrl+shift+b', function () {
				const area = appendTestArea(),
					editor = new Jodit(area, {
						commandToHotkeys: {
							bold: 'ctrl+shift+b',
							italic: ['ctrl+i', 'ctrl+shift+i']
						}
					});

				editor.value = 'test test test';

				const range = editor.s.createRange(true);
				range.setStart(editor.editor.firstChild.firstChild, 4);
				range.setEnd(editor.editor.firstChild.firstChild, 8);

				simulateEvent('keydown', 66, editor.editor, function (data) {
					data.shiftKey = true;
					data.ctrlKey = true;
				});

				expect(editor.value).equals(
					'<p>test<strong> tes</strong>t test</p>'
				);
			});
		});

		describe('Add ctrl+shift+i to default ctrl+i shortcut for italic command', function () {
			it('Should work with each of shortcuts', function () {
				const area = appendTestArea(),
					editor = new Jodit(area, {
						commandToHotkeys: {
							bold: 'ctrl+shift+b',
							italic: ['ctrl+i', 'ctrl+shift+i']
						}
					});

				editor.value = '<p>test| tes|t test</p>';
				setCursorToChar(editor);

				// standart ctrl+i
				simulateEvent('keydown', 'i', editor.editor, function (data) {
					// data.shiftKey = true;
					data.ctrlKey = true;
				});

				expect(editor.value).equals('<p>test<em> tes</em>t test</p>');

				editor.value = '<p>test| tes|t test</p>';
				setCursorToChar(editor);

				// standart ctrl+shift+i
				simulateEvent('keydown', 'i', editor.editor, function (data) {
					data.shiftKey = true;
					data.ctrlKey = true;
				});

				expect(editor.value).equals('<p>test<em> tes</em>t test</p>');

				// standart ctrl+shift+7
				simulateEvent('keydown', '7', editor.editor, function (data) {
					data.shiftKey = true;
					data.ctrlKey = true;
				});

				expect(editor.value.replace('<br>', '')).equals(
					'<ol><li>test<em> tes</em>t test</li></ol>'
				);
			});
		});
	});
});
