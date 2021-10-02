/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test interface', function () {
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

				expect(getKey(document.body, 'color-text')).eq('#222222'); // only for instance

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
