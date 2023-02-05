/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Symbols plugin', function () {
	it('Should create symbol button in toolbar and after click open dialog with symbols', function () {
		const area = appendTestArea();
		const editor = Jodit.make(area, {
			toolbarAdaptive: false,
			buttons: 'symbols'
		});
		editor.value = 'test';

		const btn = getButton('symbols', editor);
		expect(null).does.not.equal(btn);

		simulateEvent('click', 0, btn);
		const dialog = getOpenedDialog(editor);
		expect(null).does.not.equal(dialog);
	});

	describe('Symbols dialog', function () {
		it('Should have focus on first element after open', function () {
			const area = appendTestArea();
			const editor = new Jodit(area, {
				toolbarAdaptive: false,
				buttons: 'symbols'
			});
			editor.value = 'test';

			const btn = getButton('symbols', editor);
			expect(null).does.not.equal(btn);

			simulateEvent('click', 0, btn);
			const dialog = getOpenedDialog(editor);
			expect(null).does.not.equal(dialog);

			expect(dialog.querySelector('a')).equals(
				editor.ownerDocument.activeElement
			);
		});

		describe('Press key left', function () {
			it('Should select previous element', function () {
				const area = appendTestArea();
				const editor = new Jodit(area, {
					toolbarAdaptive: false,
					buttons: 'symbols'
				});
				editor.value = 'test';

				const btn = getButton('symbols', editor);

				simulateEvent('click', btn);
				const dialog = getOpenedDialog(editor);

				expect(null).does.not.equal(dialog);

				const currentActive = dialog.getElementsByTagName('a')[10];

				simulateEvent(
					'keydown',
					Jodit.KEY_LEFT,
					currentActive,
					function (data) {
						data.target = currentActive;
					}
				);

				expect(editor.ownerDocument.activeElement).equals(
					dialog.getElementsByTagName('a')[9]
				);
			});
		});

		describe('Press key right', function () {
			it('Should select next element', function () {
				const area = appendTestArea();
				const editor = new Jodit(area, {
					toolbarAdaptive: false,
					buttons: 'symbols'
				});
				editor.value = 'test';

				const btn = getButton('symbols', editor);

				simulateEvent('click', btn);
				const dialog = getOpenedDialog(editor);

				expect(null).does.not.equal(dialog);

				const currentActive = dialog.getElementsByTagName('a')[10];

				simulateEvent(
					'keydown',
					Jodit.KEY_RIGHT,
					currentActive,
					function (data) {
						data.target = currentActive;
					}
				);

				expect(editor.ownerDocument.activeElement).equals(
					dialog.getElementsByTagName('a')[11]
				);
			});
		});

		describe('Press key top', function () {
			it('Should select element above', function () {
				const area = appendTestArea();

				const editor = new Jodit(area, {
					toolbarAdaptive: false,
					buttons: 'symbols'
				});

				editor.value = 'test';

				const btn = getButton('symbols', editor);

				simulateEvent('click', 0, btn);
				const dialog = getOpenedDialog(editor);

				expect(null).does.not.equal(dialog);

				let currentActive = dialog.getElementsByTagName('a')[30];

				simulateEvent(
					'keydown',
					Jodit.KEY_UP,
					currentActive,
					function (data) {
						data.target = currentActive;
					}
				);

				expect(editor.ownerDocument.activeElement).equals(
					dialog.getElementsByTagName('a')[13]
				);

				currentActive = dialog.getElementsByTagName('a')[10];

				simulateEvent(
					'keydown',
					Jodit.KEY_UP,
					currentActive,
					function (data) {
						data.target = currentActive;
					}
				);

				expect(editor.ownerDocument.activeElement).equals(
					dialog.getElementsByTagName('a')[197]
				);
			});
		});

		describe('Press key bottom', function () {
			it('Should select element below', function () {
				const area = appendTestArea();
				const editor = new Jodit(area, {
					toolbarAdaptive: false,
					buttons: 'symbols'
				});
				editor.value = 'test';

				const btn = getButton('symbols', editor);

				simulateEvent('click', 0, btn);
				const dialog = getOpenedDialog(editor);

				expect(null).does.not.equal(dialog);

				let currentActive = dialog.getElementsByTagName('a')[30];

				simulateEvent(
					'keydown',
					Jodit.KEY_DOWN,
					currentActive,
					function (data) {
						data.target = currentActive;
					}
				);

				expect(editor.ownerDocument.activeElement).equals(
					dialog.getElementsByTagName('a')[47]
				);

				currentActive = dialog.getElementsByTagName('a')[200];

				simulateEvent(
					'keydown',
					Jodit.KEY_DOWN,
					currentActive,
					function (data) {
						data.target = currentActive;
					}
				);

				expect(editor.ownerDocument.activeElement).equals(
					dialog.getElementsByTagName('a')[13]
				);
			});
		});

		describe('Press Enter or mousdown on element', function () {
			it('Should insert character', function () {
				const area = appendTestArea();
				const editor = new Jodit(area, {
					toolbarAdaptive: false,
					buttons: 'symbols'
				});

				editor.value = '<p>test|</p>';
				setCursorToChar(editor);

				const btn = getButton('symbols', editor);

				simulateEvent('click', btn);
				let dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;

				const currentActive = dialog.getElementsByTagName('a')[5];

				simulateEvent('keydown', Jodit.KEY_ENTER, currentActive);

				expect(editor.value).equals('<p>test&amp;</p>');

				simulateEvent('click', btn); //  close previous
				simulateEvent('click', btn);
				dialog = getOpenedDialog(editor);

				expect(dialog).is.not.null;

				const currentActive2 = dialog.getElementsByTagName('a')[125];

				simulateEvent('mousedown', currentActive2);

				expect(editor.value).equals('<p>test&amp;½</p>');
			});
		});
	});

	describe('Symbols popup', function () {
		it('Should create popup this symbols', function () {
			const area = appendTestArea();
			const editor = new Jodit(area, {
				toolbarAdaptive: false,
				buttons: 'symbols',
				usePopupForSpecialCharacters: true
			});

			editor.value = 'test';

			const range = editor.s.createRange(true);
			range.setStart(editor.editor.firstChild, 0);
			range.collapse(true);

			const btn = getButton('symbols', editor);

			simulateEvent('click', 0, btn);
			const dialog = getOpenedDialog(editor);

			expect(null).equals(dialog);

			const popup = getOpenedPopup(editor);
			expect(null).does.not.equal(popup);

			const currentActive = popup.getElementsByTagName('a')[125];

			simulateEvent('mousedown', 0, currentActive);

			expect(editor.value).equals('<p>½test</p>');
			expect(popup.parentNode).is.null;
		});
	});
});
