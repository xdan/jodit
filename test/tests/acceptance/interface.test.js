/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test interface', function () {
	describe('Toolbar buttons when options.cache is disabled', function () {
		// Regression: ToolbarButton.createContainer (@cacheHTML) defined
		// `component` on the button element without `configurable`, i.e.
		// non-configurable. The constructor then redefines it. With
		// cache:false the container is not cloned, so a button built after an
		// editor has become ready reaches the constructor already carrying a
		// non-configurable `component` -> "Cannot redefine property: component".
		it('Should build a second editor without throwing', () => {
			const first = getJodit({ cache: false });
			first.destruct();

			const second = getJodit({ cache: false });

			expect(
				second.container.querySelectorAll('.jodit-toolbar-button')
					.length
			).above(0);

			const button = second.container.querySelector(
				'.jodit-toolbar-button button'
			);
			expect(button).is.not.null;
			expect(button.component).is.not.null;
		});
	});

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

	describe('Dropdown arrow of a toolbar button', function () {
		it("Should be drawn in the icons' colour, not in the colour of the text round it", () => {
			const editor = getJodit({
				containerStyle: {
					color: '#ffffff'
				}
			});

			const stroke = selector =>
				getComputedStyle(editor.container.querySelector(selector))
					.stroke;

			expect(
				stroke(
					'.jodit-toolbar-button_paragraph .jodit-toolbar-button__trigger svg'
				)
			).equals(stroke('.jodit-toolbar-button_bold svg'));
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

	(Jodit.ES === 'es5' ? describe.skip : describe)(
		'Style values',
		function () {
			describe('Set styleValues dictionary', () => {
				it('Should apply keys of it as custom properties in CSS in instance', () => {
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

					expect(getKey(editor.container, 'color-text')).eq(
						'#F9D90F'
					);
					expect(getKey(editor.container, 'color-border')).eq(
						'#1AB942'
					);
					expect(getKey(editor.container, 'color-panel')).eq(
						'#E23DAA'
					);

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
		}
	);

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

			expect(dialog.textContent.match(/License:.*(111)/)).is.not.null;
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

				expect(editor.editor.getAttribute('dir')).equals('rtl');
				expect(editor.container.getAttribute('dir')).equals('rtl');
				expect(editor.toolbar.container.getAttribute('dir')).equals(
					'rtl'
				);
			});

			describe('Source editor', function () {
				it('Should have RTL direction', function () {
					const editor = getJodit({
						direction: 'rtl',
						sourceEditor: 'area'
					});
					clickButton('source', editor);
					expect(
						editor.container
							.querySelector('.jodit-source__mirror')
							.getAttribute('dir')
					).equals('rtl');
				});
			});

			describe('Open some dialog', function () {
				it('Should have RTL direction', function () {
					const editor = getJodit({
						direction: 'rtl'
					});
					editor.alert('Hello');
					const dialog = getOpenedDialog(editor);
					expect(dialog.getAttribute('dir')).equals('rtl');
				});
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
