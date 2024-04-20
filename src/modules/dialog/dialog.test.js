/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Dialog system tests', function () {
	describe('About dialog', function () {
		it('Should be opened when use clicks on the About button', function () {
			getBox().style.width = '100%';

			const editor = getJodit({
				disablePlugins: 'mobile'
			});

			const about = getButton('about', editor);
			expect(about).is.not.null;

			simulateEvent('click', 0, about);

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.not.null;

			expect(dialog.innerHTML.indexOf('xdsoft.net') !== -1).is.true;
		});

		describe('Close About dialog', function () {
			it('Should show Close button in right top corner and close dialog after click', function () {
				getBox().style.width = '100%';
				const editor = getJodit({
					disablePlugins: 'mobile'
				});

				const about = getButton('about', editor);
				expect(about).is.not.null;

				simulateEvent('click', 0, about);

				const dialog = getOpenedDialog(editor);
				expect(dialog).is.not.null;

				expect(dialog.innerHTML.indexOf('xdsoft.net') !== -1).is.true;

				const close = getButton('close', dialog);
				expect(close).is.not.null;

				simulateEvent('click', 0, close);

				expect(getOpenedDialog(editor)).is.null;

				expect(dialog.parentElement).is.null;
			});
		});
	});

	describe('Popup inside dialog', function () {
		it('Should be opened under dialog', function () {
			getBox().style.width = '100%';

			const editor = getJodit({
				filebrowser: {
					ajax: {
						url: 'https://xdsoft.net/jodit/connector/index.php'
					}
				}
			});
			editor.value = '<img alt="" src="tests/artio.jpg"/>';
			editor.s.focus();

			simulateEvent('click', editor.editor.querySelector('img'));

			const popup = getOpenedPopup(editor);

			clickButton('pencil', popup);

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.not.null;

			const form = dialog.querySelector(
				'.jodit-ui-image-properties-form'
			).component;

			const changeImage = form.getElm('changeImage');
			expect(changeImage).is.not.null;

			simulateEvent('click', changeImage);

			const popup2 = getOpenedPopup(dialog.component);
			expect(popup2).is.not.null;

			const pos = Jodit.modules.Helpers.position(popup2),
				elm = document.elementFromPoint(pos.left + 20, pos.top + 20);

			expect(Jodit.modules.Dom.isOrContains(popup2, elm)).is.true;
		});
	});

	describe('Short Jodit.Alert etc static methods', function () {
		it('Should work without Jodit instance', function () {
			const dialog = Jodit.Alert('Hello');
			dialog.close();
		});

		it('Should return Dialog instance', function () {
			const dialog = Jodit.Alert('Hello');
			expect(dialog instanceof Jodit.modules.Dialog).is.true;
			dialog.close();
		});

		describe('Show not string', function () {
			it('Should show dialog with toString value', function () {
				const dialog = Jodit.Alert(111);
				expect(
					dialog.dialog.querySelector('.jodit-dialog__content')
						.textContent
				).equals('111');
				dialog.close();
			});
		});
		it('Should get string or HTMLElement or array of string or array of HTMLElement in arguments', function () {
			const dialog = Jodit.Alert(['<div id="hello1">Hello</div>']);
			expect(document.getElementById('hello1')).is.not.null;
			dialog.close();

			const dialog2 = Jodit.Alert(document.createTextNode('Test'));
			expect(dialog2 instanceof Jodit.modules.Dialog).is.true;
			dialog2.close();

			const div = document.createElement('div');
			div.id = 'hello3';
			const dialog3 = Jodit.Alert(div);
			expect(div).equals(document.getElementById('hello3'));
			dialog3.close();
		});
	});
});
