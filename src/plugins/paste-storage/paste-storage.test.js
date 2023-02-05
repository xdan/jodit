/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Paste storage', function () {
	describe('Empty list', function () {
		it('Sholud not show dialog', function () {
			const editor = getJodit();

			simulateEvent('keydown', 'v', editor.editor, function (data) {
				data.ctrlKey = true;
				data.shiftKey = true;
			});

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.null;
		});
	});

	describe('After copy elements', function () {
		it('Sholud show dialog with pasted list', function () {
			const editor = getJodit({
				observer: {
					timeout: 0
				}
			});

			editor.s.focus();
			editor.value = 'abcde';
			const range = editor.ownerDocument.createRange();

			range.setStart(editor.editor.firstChild, 0);
			range.setEnd(editor.editor.firstChild, 1);
			editor.s.selectRange(range);

			simulateEvent('copy', 0, editor.editor, function (data) {
				Object.defineProperty(data, 'clipboardData', {
					value: {
						getData: function () {},
						setData: function () {}
					}
				});
			});

			range.setStart(editor.editor.firstChild.firstChild, 1);
			range.setEnd(editor.editor.firstChild.firstChild, 2);
			editor.s.selectRange(range);

			simulateEvent('copy', 0, editor.editor, function (data) {
				Object.defineProperty(data, 'clipboardData', {
					value: {
						getData: function () {},
						setData: function () {}
					}
				});
			});

			simulateEvent('keydown', 'v', editor.editor, function (data) {
				data.ctrlKey = true;
				data.shiftKey = true;
			});

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.not.null;
		});

		describe('After click on some of elements', function () {
			it('Sholud select this', function () {
				const editor = getJodit();

				editor.value = 'abcde';
				const range = editor.ownerDocument.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 0);
				range.setEnd(editor.editor.firstChild.firstChild, 1);
				editor.s.selectRange(range);

				simulateEvent('copy', 0, editor.editor, function (data) {
					Object.defineProperty(data, 'clipboardData', {
						value: {
							getData: function () {},
							setData: function () {}
						}
					});
				});

				range.setStart(editor.editor.firstChild.firstChild, 1);
				range.setEnd(editor.editor.firstChild.firstChild, 2);
				editor.s.selectRange(range);

				simulateEvent('copy', 0, editor.editor, function (data) {
					Object.defineProperty(data, 'clipboardData', {
						value: {
							getData: function () {},
							setData: function () {}
						}
					});
				});

				simulateEvent('keydown', 'v', editor.editor, function (data) {
					data.ctrlKey = true;
					data.shiftKey = true;
				});

				const dialog = getOpenedDialog(editor);
				expect(dialog).is.not.null;

				simulateEvent(
					'click',
					0,
					dialog.querySelectorAll('.jodit-paste-storage a')[1]
				);

				expect(
					dialog
						.querySelectorAll('.jodit-paste-storage a')[1]
						.classList.contains('jodit_active')
				).is.true;

				simulateEvent(
					'dblclick',
					0,
					dialog.querySelectorAll('.jodit-paste-storage a')[1]
				);

				expect(dialog.parentNode).is.null;

				expect(editor.value).equals('<p>aacde</p>');
			});
		});

		describe('Press key up/down/enter', function () {
			it('Sholud select next/previos element of list and insert selected value after Enter', function () {
				const editor = getJodit();

				editor.value = 'abcde';
				const range = editor.ownerDocument.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 0);
				range.setEnd(editor.editor.firstChild.firstChild, 1);
				editor.s.selectRange(range);

				simulateEvent('copy', 0, editor.editor, function (data) {
					Object.defineProperty(data, 'clipboardData', {
						value: {
							getData: function () {},
							setData: function () {}
						}
					});
				});

				range.setStart(editor.editor.firstChild.firstChild, 1);
				range.setEnd(editor.editor.firstChild.firstChild, 2);
				editor.s.selectRange(range);

				simulateEvent('copy', 0, editor.editor, function (data) {
					Object.defineProperty(data, 'clipboardData', {
						value: {
							getData: function () {},
							setData: function () {}
						}
					});
				});

				simulateEvent('keydown', 'v', editor.editor, function (data) {
					data.ctrlKey = true;
					data.shiftKey = true;
				});

				const dialog = getOpenedDialog(editor);
				expect(dialog).is.not.null;

				simulateEvent(
					'click',
					0,
					dialog.querySelectorAll('.jodit-paste-storage a')[0]
				);
				expect(
					dialog
						.querySelectorAll('.jodit-paste-storage a')[0]
						.classList.contains('jodit_active')
				).is.true;

				simulateEvent(
					'keydown',
					Jodit.KEY_UP,
					dialog.querySelectorAll('.jodit-paste-storage a')[0]
				);
				expect(
					dialog
						.querySelectorAll('.jodit-paste-storage a')[1]
						.classList.contains('jodit_active')
				).is.true;

				simulateEvent(
					'keydown',
					Jodit.KEY_UP,
					dialog.querySelectorAll('.jodit-paste-storage a')[1]
				);
				expect(
					dialog
						.querySelectorAll('.jodit-paste-storage a')[0]
						.classList.contains('jodit_active')
				).is.true;

				simulateEvent(
					'keydown',
					Jodit.KEY_DOWN,
					dialog.querySelectorAll('.jodit-paste-storage a')[0]
				);
				expect(
					dialog
						.querySelectorAll('.jodit-paste-storage a')[1]
						.classList.contains('jodit_active')
				).is.true;

				simulateEvent(
					'keydown',
					Jodit.KEY_ENTER,
					dialog.querySelectorAll('.jodit-paste-storage a')[0]
				);

				expect(dialog.parentNode).is.null;

				expect(editor.value).equals('<p>aacde</p>');
			});
		});
	});
});
