/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test interface', function () {
	describe('Style', function () {
		it('Should apply style to the editable area', () => {
			const editor = getJodit({
				style: {
					color: '#F9D90F'
				}
			});

			expect(
				Jodit.modules.Helpers.normalizeColor(editor.editor.style.color)
			).eq('#F9D90F');
		});
	});

	describe('containerStyle', function () {
		it('Should apply style to the main container area', () => {
			const editor = getJodit({
				containerStyle: {
					color: '#F9D90F'
				}
			});

			expect(
				Jodit.modules.Helpers.normalizeColor(
					editor.container.style.color
				)
			).eq('#F9D90F');
		});
	});

	describe('className', function () {
		it('Should apply className to the main container area', () => {
			const editor = getJodit({
				className: 'a b c'
			});

			expect(editor.container.classList.contains('jodit-container')).is
				.true;
			expect(editor.container.classList.contains('a')).is.true;
			expect(editor.container.classList.contains('b')).is.true;
			expect(editor.container.classList.contains('c')).is.true;
		});
	});

	describe('editorClassName', function () {
		it('Should apply className to the editable area', () => {
			const editor = getJodit({
				editorClassName: 'a b c'
			});

			expect(editor.editor.classList.contains('jodit-wysiwyg')).is.true;
			expect(editor.editor.classList.contains('a')).is.true;
			expect(editor.editor.classList.contains('b')).is.true;
			expect(editor.editor.classList.contains('c')).is.true;
		});
	});

	describe('Style values', function () {
		describe('Set styleValues dictionary', () => {
			it('Should apply keys of it ass custom properties in CSS in instance', () => {
				const getKey = (elm, key) =>
					window
						.getComputedStyle(elm)
						.getPropertyValue('--jd-' + key)
						.trim();

				const editor = getJodit({
					styleValues: {
						'color-text': '#F9D90F',
						colorBorder: '#1AB942',
						'color-Panel': '#E23DAA'
					}
				});

				expect(getKey(editor.container, 'color-text')).eq('#F9D90F');
				expect(getKey(editor.container, 'color-border')).eq('#1AB942');
				expect(getKey(editor.container, 'color-panel')).eq('#E23DAA');

				expect(
					Jodit.modules.Helpers.normalizeColor(
						getKey(document.body, 'color-text')
					)
				).eq('#222222'); // only for instance

				expect(
					Jodit.modules.Helpers.normalizeColor(
						window.getComputedStyle(
							editor.toolbar.container.parentNode
						).backgroundColor
					)
				).eq('#E23DAA'); // only for instance
			});
		});
	});

	describe('About dialog', function () {
		it('Should contains License element', function () {
			const editor = getJodit({
				license: '111',
				toolbarAdaptive: false
			});

			const aboutButton = getButton('about', editor);

			expect(aboutButton).is.not.null;
			simulateEvent('click', 0, aboutButton);

			const dialog = getOpenedDialog(editor);

			expect(dialog).is.not.null;

			expect(dialog.textContent.match(/License:.*(MIT)/)).is.not.null;
		});

		describe('Set license', function () {
			it('Should show License in about dialog', function () {
				const editor = getJodit({
					license: '12345-67890-12345-67890', // don't use this key - it is wrong
					toolbarAdaptive: false
				});

				const aboutButton = getButton('about', editor);

				expect(aboutButton).is.not.null;
				simulateEvent('click', 0, aboutButton);

				const dialog = getOpenedDialog(editor);
				expect(dialog).is.not.null;

				expect(dialog.textContent.match(/License:.*(GPL|GNU)/)).is.null;

				expect(
					dialog.textContent.match(
						/License: 12345-67-\*\*\*\*\*\*\*\*-\*\*\*\*\*\*\*/
					)
				).is.not.null;
			});
		});
	});

	describe('Direction', function () {
		describe('Set RTL direction', function () {
			it('Should have RTL direction', function () {
				const editor = getJodit({
					direction: 'rtl'
				});

				expect('rtl').equals(editor.editor.getAttribute('dir'));
				expect('rtl').equals(editor.container.getAttribute('dir'));
				expect('rtl').equals(
					editor.toolbar.container.getAttribute('dir')
				);
			});
		});

		describe('For iframe mode', function () {
			it('Should have same direction and language', function () {
				const editor = getJodit({
					iframe: true,
					direction: 'rtl',
					language: 'de'
				});

				expect('rtl').equals(
					editor.ed.documentElement.getAttribute('dir')
				);
				expect('de').equals(
					editor.ed.documentElement.getAttribute('lang')
				);
			});
		});
	});
});
