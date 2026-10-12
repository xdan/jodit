/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Font test', function () {
	// https://github.com/xdan/jodit/issues/1370
	describe('font select button label (#1370)', () => {
		const btnText = editor =>
			(
				editor.container.querySelector('[data-ref="font"]')
					?.textContent || ''
			).trim();

		const make = () =>
			getJodit({
				history: { timeout: 0 },
				toolbarAdaptive: false,
				buttons: 'font',
				controls: { font: { component: 'select' } }
			});

		it('Should show Default for unstyled text, not the raw font stack', async () => {
			const editor = make();
			editor.value = '<p>plain text</p>';
			editor.s.focus();
			editor.s.setCursorIn(editor.editor.querySelector('p').firstChild);
			editor.e.fire('updateToolbar');
			await delay(80);

			expect(btnText(editor)).equals('Default');
			editor.destruct();
		});

		it('Should show the font family for styled text', async () => {
			const editor = make();
			editor.value =
				'<p><span style="font-family: Georgia, Palatino, serif">x</span></p>';
			editor.s.focus();
			editor.s.setCursorIn(
				editor.editor.querySelector('span').firstChild
			);
			editor.e.fire('updateToolbar');
			await delay(80);

			expect(btnText(editor)).equals('Georgia');
			editor.destruct();
		});
	});

	describe('font select button label without a Default entry', () => {
		const btnText = editor =>
			editor.container
				.querySelector('[data-ref="font"]')
				.textContent.trim();

		const make = (options = {}) =>
			getJodit({
				toolbarAdaptive: false,
				buttons: 'font',
				controls: {
					font: {
						component: 'select',
						list: Jodit.atom({
							'Arial, Helvetica, sans-serif': 'Arial',
							'Georgia, Palatino, serif': 'Georgia'
						})
					}
				},
				...options
			});

		it("Should show the editor's font before there is a selection", async () => {
			const editor = make({
				style: { fontFamily: 'Gotham, sans-serif' }
			});
			editor.value = '<p>plain text</p>';
			editor.e.fire('updateToolbar');
			await delay(80);

			expect(editor.s.current()).is.null;
			expect(btnText(editor)).equals('Gotham');
			editor.destruct();
		});

		it("Should show the font of an iframe's stylesheet that arrives late", async () => {
			const editor = make({ iframe: true });
			editor.value = '<p>plain text</p>';
			await delay(80);

			expect(btnText(editor)).does.not.equal('Gotham');

			const link = editor.ed.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'data:text/css,body{font-family:Gotham,sans-serif}';
			editor.ed.head.appendChild(link);
			await delay(200);

			expect(btnText(editor)).equals('Gotham');
			editor.destruct();
		});

		it('Should keep the last font once the selection leaves the editor', async () => {
			const editor = make();
			editor.value =
				'<p><span style="font-family: Georgia, Palatino, serif">x</span></p>';
			editor.s.focus();
			editor.s.setCursorIn(
				editor.editor.querySelector('span').firstChild
			);
			editor.e.fire('updateToolbar');
			await delay(80);

			expect(btnText(editor)).equals('Georgia');

			editor.ed.getSelection().removeAllRanges();
			editor.e.fire('updateToolbar');
			await delay(80);

			expect(btnText(editor)).equals('Georgia');
			editor.destruct();
		});
	});

	describe('FontName', function () {
		describe('Open fontname list and select some element', function () {
			it('Should apply this font to current selection elements', function () {
				const editor = getJodit({
					toolbarAdaptive: false
				});

				editor.value = '<p>|test|</p>';
				setCursorToChar(editor);

				const openFontNameList = function () {
					simulateEvent('mousedown', editor.editor);
					clickTrigger('font', editor);

					const list = getOpenedPopup(editor);

					return Array.from(list.querySelectorAll('button')).slice(1);
				};

				expect(openFontNameList()).is.not.null;

				simulateEvent('mousedown', editor.editor);

				Array.from(openFontNameList()).map(function (font, index) {
					editor.value = '<p>|test|</p>';
					setCursorToChar(editor);

					const btn = openFontNameList()[index];

					simulateEvent('click', btn);

					const fontFamily = btn
						.querySelector('span[style]')
						.getAttribute('data-style')
						.replace(/"/g, "'");

					expect(sortAttributes(editor.value)).equals(
						sortAttributes(
							`<p><span style="font-family:${fontFamily.replace(
								'!important',
								''
							)}">test</span></p>`
						)
					);
				});
			});

			describe('Extends standard font list', function () {
				it('Should standart font list elements', function () {
					const editor = getJodit({
						toolbarAdaptive: false,
						controls: {
							font: {
								list: {
									"-apple-system,BlinkMacSystemFont,'Segoe WPC','Segoe UI',HelveticaNeue-Light,Ubuntu,'Droid Sans',sans-serif":
										'OS System Font'
								}
							}
						}
					});

					editor.value = '<p>test</p>';
					editor.s.select(editor.editor.firstChild.firstChild);

					clickTrigger('font', editor);

					const list = getOpenedPopup(editor);

					expect(list).is.not.null;

					const buttons = list.querySelectorAll('button'),
						font = buttons[0];

					simulateEvent('click', font);

					expect(sortAttributes(editor.value)).equals(
						sortAttributes(
							"<p><span style=\"font-family:-apple-system,BlinkMacSystemFont,'Segoe WPC','Segoe UI',HelveticaNeue-Light,Ubuntu,'Droid Sans',sans-serif\">test</span></p>"
						)
					);
				});
			});
		});
	});

	describe('Change font-family and fomt-size in same time', () => {
		it('should save font-size after font-family', () => {
			const editor = getJodit();
			editor.value = '<p>|</p>';
			setCursorToChar(editor);

			clickTrigger('fontsize', editor);
			const list = getOpenedPopup(editor);

			clickButton('10', list);
			editor.s.insertHTML('test');

			expect(sortAttributes(editor.value)).equals(
				'<p><span style="font-size:10px">test</span></p>'
			);

			clickTrigger('font', editor);
			const list2 = getOpenedPopup(editor);

			clickButton('Impact__Charcoal__sans_serif', list2);
			editor.s.insertHTML('stop');

			expect(sortAttributes(editor.value)).equals(
				'<p><span style="font-size:10px">test' +
					'<span style="font-family:Impact,Charcoal,sans-serif">stop</span></span></p>'
			);
		});
	});

	['pt', 'px'].forEach(function (point) {
		describe('Font size:' + point, function () {
			describe('State', function () {
				describe('First click on the button', function () {
					it('Should open list', function () {
						const editor = getJodit({
							defaultFontSizePoints: point
						});

						clickButton('fontsize', editor);

						const popup = getOpenedPopup(editor);

						expect(popup).is.not.null;
					});

					describe('Second click on the button', function () {
						it('Should again open popup', function () {
							const editor = getJodit({
								defaultFontSizePoints: point
							});

							editor.value = 'text2text';

							const range = editor.s.createRange(true);

							range.setStart(
								editor.editor.firstChild.firstChild,
								3
							);
							range.setEnd(
								editor.editor.firstChild.firstChild,
								6
							);

							clickButton('fontsize', editor);

							const popup = getOpenedPopup(editor);

							expect(popup).is.not.null;

							clickButton('8', popup);

							expect(sortAttributes(editor.value)).equals(
								`<p>tex<span style="font-size:8${point}">t2t</span>ext</p>`
							);

							const range2 = editor.s.createRange(true);

							range2.setStartAfter(editor.editor.firstChild);

							clickButton('fontsize', editor);

							const popup2 = getOpenedPopup(editor);

							expect(popup2).is.not.null;
						});
					});
				});
			});
		});
	});

	describe('Font size with pt mode', function () {
		it('Should apply font size in pt and show correct active state', function () {
			const editor = getJodit({
				defaultFontSizePoints: 'pt',
				toolbarAdaptive: false,
				history: {
					timeout: 0
				}
			});

			editor.value =
				'<p>test<span style="font-size: 14pt">bold</span></p>';
			editor.s.focus();

			const p = editor.editor.firstChild;
			const font = getButton('fontsize', editor);

			expect(font).is.not.null;

			editor.s.setCursorIn(p.lastChild);
			simulateEvent('mousedown', p);

			expect(font.getAttribute('aria-pressed')).equals('true');
		});

		it('Should apply font size with pt unit when selecting from list', function () {
			const editor = getJodit({
				defaultFontSizePoints: 'pt'
			});

			editor.value = '<p>|test|</p>';
			setCursorToChar(editor);

			clickTrigger('fontsize', editor);
			const list = getOpenedPopup(editor);
			clickButton('14', list);

			expect(sortAttributes(editor.value)).equals(
				'<p><span style="font-size:14pt">test</span></p>'
			);
		});
	});

	describe('Font family', function () {
		describe('State', function () {
			describe('First click on the button', function () {
				it('Should open list', function () {
					const editor = getJodit();

					clickButton('font', editor);

					const popup = getOpenedPopup(editor);

					expect(popup).is.not.null;
				});

				describe('Second click on the button', function () {
					it('Should apply open popup again', function () {
						const editor = getJodit();

						editor.value = 'text2text';

						const range = editor.s.createRange(true);

						range.setStart(editor.editor.firstChild.firstChild, 3);
						range.setEnd(editor.editor.firstChild.firstChild, 6);

						clickButton('font', editor);

						const popup = getOpenedPopup(editor);

						expect(popup).is.not.null;

						clickButton('Impact__Charcoal__sans_serif', popup);

						expect(editor.value).equals(
							'<p>tex<span style="font-family: Impact, Charcoal, sans-serif;">t2t</span>ext</p>'
						);

						const range2 = editor.s.createRange(true);

						range2.setStartAfter(editor.editor.firstChild);

						clickButton('font', editor);

						const popup2 = getOpenedPopup(editor);

						expect(popup2).is.not.null;
					});
				});
			});
		});
	});

	describe('Active', function () {
		describe('In list', function () {
			describe('Fontsize button', function () {
				it('Should be activated then element has some style value', function () {
					const editor = getJodit({
						history: {
							timeout: 0
						}
					});

					editor.value =
						'<p>test<span style="font-size: 12px">bold</span></p>';
					editor.s.focus();

					const p = editor.editor.firstChild;
					const font = getButton('fontsize', editor);

					expect(font).is.not.null;

					editor.s.setCursorAfter(p.firstChild);
					simulateEvent('mousedown', p);
					expect(font.getAttribute('aria-pressed')).equals('true');

					editor.s.setCursorIn(p.lastChild);

					simulateEvent('mousedown', p);

					clickTrigger('fontsize', editor);

					const font12 = getOpenedPopup(editor).querySelector(
						'[role="listitem"][class*="12"]'
					);

					expect(font12.getAttribute('aria-pressed')).equals('true');
				});
			});

			describe('Font family button', function () {
				it('Should be activated then element has some style value', function () {
					const editor = getJodit({
						toolbarAdaptive: false,
						history: {
							timeout: 0
						}
					});

					editor.value =
						'<p>test<span style="font-family: georgia,palatino,serif;">bold</span></p>';
					editor.s.focus();

					const p = editor.editor.firstChild;
					const font = getButton('font', editor);

					expect(font).is.not.null;

					editor.s.setCursorAfter(p.firstChild);
					simulateEvent('mousedown', p);
					expect(font.getAttribute('aria-pressed')).equals('false');

					editor.s.setCursorIn(p.lastChild);

					simulateEvent('mousedown', p);

					clickTrigger('font', editor);

					const popup = getOpenedPopup(editor);

					const fontGeorgia = popup.querySelector(
						'[class*=Georgia__Palatino__serif]'
					);

					expect(fontGeorgia).does.not.equal(font);
					expect(fontGeorgia.hasAttribute('aria-pressed')).is.true;
				});
			});
		});
	});
});

describe('Google Fonts', () => {
	const url = 'https://fonts.test/webfonts';

	const library = {
		items: [
			{
				family: 'ABeeZee',
				category: 'sans-serif',
				variants: ['regular', 'italic']
			},
			{ family: 'Buda', category: 'display', variants: ['300'] },
			{
				family: 'Pacifico',
				category: 'handwriting',
				variants: ['regular']
			},
			{
				family: 'Roboto',
				category: 'sans-serif',
				variants: ['100', 'regular', 'italic', '700', '700italic']
			}
		]
	};

	let editor, send;

	const make = (value, options = {}) => {
		editor = getJodit({
			toolbarAdaptive: false,
			buttons: 'font',
			font: { googleFonts: { url } },
			...options
		});
		editor.value = value;
		return editor;
	};

	const open = () => {
		editor.s.focus();
		editor.s.setCursorIn(
			editor.editor.querySelector('span') || editor.editor.firstChild
		);
		clickTrigger('font', editor);
		return getOpenedPopup(editor);
	};

	const sections = popup =>
		Array.from(
			popup.querySelectorAll('.jodit-ui-font-picker__group'),
			group => [
				group.getAttribute('aria-labelledby') &&
					document.getElementById(
						group.getAttribute('aria-labelledby')
					).textContent,
				Array.from(
					group.querySelectorAll('.jodit-ui-font-picker__item'),
					item => item.textContent
				)
			]
		);

	const fontLinks = () =>
		Array.from(
			document.head.querySelectorAll(
				'link[href^="https://fonts.googleapis.com/css2"]'
			),
			link => decodeURIComponent(link.href)
		);

	beforeEach(() => {
		send = Jodit.modules.Ajax.prototype.send;

		Jodit.modules.Ajax.prototype.send = function () {
			return this.o.url === url
				? Promise.resolve({ json: () => Promise.resolve(library) })
				: send.call(this);
		};
	});

	afterEach(() => {
		Jodit.modules.Ajax.prototype.send = send;
		editor && editor.destruct();
		editor = null;
	});

	it('Should list the used, system and Google fonts under their headings', () => {
		make(
			'<p><span style="font-family: Pacifico, cursive">a</span>' +
				'<span style="font-family: Georgia, Palatino, serif">b</span></p>'
		);

		const groups = sections(open()),
			items = Object.fromEntries(groups);

		expect(groups[0]).deep.equals([null, ['Default']]);
		expect(groups.slice(-3).map(([heading]) => heading)).deep.equals([
			'Used fonts',
			'System fonts',
			'Google Fonts'
		]);
		expect(items['Used fonts']).deep.equals(['Pacifico', 'Georgia']);
		expect(items['System fonts']).contains('Times New Roman');
		expect(items['Google Fonts']).deep.equals([
			'ABeeZee',
			'Pacifico',
			'Roboto'
		]);
	});

	it('Should list the fonts the editor gives text and headings as theme fonts', () => {
		const style = document.createElement('style');
		style.textContent = '.jodit-wysiwyg h2 { font-family: Pacifico }';
		document.head.appendChild(style);

		try {
			make('<p>a</p>', {
				style: { fontFamily: "'Roboto', sans-serif" }
			});

			const [, theme] = sections(open());

			expect(theme).deep.equals(['Theme fonts', ['Roboto', 'Pacifico']]);
			expect(editor.editor.querySelector('h2')).is.null;
		} finally {
			style.remove();
		}
	});

	it('Should list a theme font that is in neither the list nor the library', () => {
		make('<p>a</p>', { style: { fontFamily: 'Gotham, sans-serif' } });

		const theme = sections(open()).find(
			([heading]) => heading === 'Theme fonts'
		);

		expect(theme).deep.equals(['Theme fonts', ['Gotham']]);
	});

	it('Should name the font of unstyled text when the list has no Default entry', async () => {
		make('<p>test</p>', {
			style: { fontFamily: "'Roboto', sans-serif" },
			controls: {
				font: {
					component: 'select',
					list: Jodit.atom({ 'Georgia, serif': 'Georgia' })
				}
			}
		});
		editor.s.focus();
		editor.s.setCursorIn(editor.editor.querySelector('p').firstChild);
		editor.e.fire('updateToolbar');
		await delay(80);

		expect(
			editor.container
				.querySelector('[data-ref="font"]')
				.textContent.trim()
		).equals('Roboto');

		simulateEvent(
			['mousedown', 'mouseup', 'click'],
			editor.container.querySelector(
				'.jodit-toolbar-select_font [aria-haspopup="true"]'
			)
		);

		const popup = getOpenedPopup(editor);

		expect(
			popup.querySelector('.jodit-ui-font-picker__item').textContent
		).equals('Roboto');
		expect(
			Array.from(
				popup.querySelectorAll('[aria-pressed="true"]'),
				item => item.textContent
			)
		).deep.equals(['Roboto', 'Roboto']);
	});

	it('Should take the font off when choosing the one the text has without it', () => {
		make(
			'<p><span style="font-family: Pacifico, cursive">test</span></p>',
			{
				style: { fontFamily: "'Roboto', sans-serif" }
			}
		);
		editor.s.focus();
		editor.s.select(editor.editor.querySelector('span'));

		clickTrigger('font', editor);

		const roboto = Array.from(
			getOpenedPopup(editor).querySelectorAll(
				'.jodit-ui-font-picker__item'
			)
		).find(item => item.textContent === 'Roboto');

		simulateEvent('click', roboto);

		expect(editor.value).equals('<p>test</p>');
		expect(fontLinks().some(link => link.includes('family=Roboto:'))).is
			.false;
	});

	it('Should not change the list without the option', () => {
		editor = getJodit({ toolbarAdaptive: false, buttons: 'font' });
		editor.value = '<p>a</p>';

		const popup = open();

		expect(popup.querySelector('.jodit-ui-font-picker')).is.null;
		expect(popup.querySelectorAll('.jodit-toolbar-button').length).equals(
			Object.keys(editor.o.controls.font.list).length
		);
	});

	it('Should press the font of the selection', () => {
		make(
			'<p><span style="font-family: \'Roboto\', sans-serif">a</span></p>'
		);

		const pressed = Array.from(
			open().querySelectorAll('[aria-pressed="true"]'),
			item => item.textContent
		);

		expect(pressed).deep.equals(['Roboto', 'Roboto']);
	});

	it('Should apply a Google font and load its styles into the editor', () => {
		make('<p>test</p>');
		editor.s.focus();
		editor.s.select(editor.editor.firstChild.firstChild);

		clickTrigger('font', editor);

		const roboto = Array.from(
			getOpenedPopup(editor).querySelectorAll(
				'.jodit-ui-font-picker__item'
			)
		).find(item => item.textContent === 'Roboto');

		simulateEvent('click', roboto);

		expect(sortAttributes(editor.value)).equals(
			sortAttributes(
				'<p><span style="font-family: Roboto, sans-serif;">test</span></p>'
			)
		);
		expect(getOpenedPopup(editor)).is.null;
		expect(fontLinks()).contains(
			'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap'
		);
	});

	it('Should fall back to sans-serif for a handwriting font', () => {
		make('<p>test</p>');
		editor.s.focus();
		editor.s.select(editor.editor.firstChild.firstChild);

		clickTrigger('font', editor);

		const pacifico = Array.from(
			getOpenedPopup(editor).querySelectorAll(
				'.jodit-ui-font-picker__item'
			)
		).find(item => item.textContent === 'Pacifico');

		simulateEvent('click', pacifico);

		expect(sortAttributes(editor.value)).equals(
			sortAttributes(
				'<p><span style="font-family: Pacifico, sans-serif;">test</span></p>'
			)
		);
	});

	it('Should load the Google fonts the content uses, and remove them with the editor', () => {
		make('<p><span style="font-family: Pacifico, cursive">a</span></p>');

		expect(fontLinks()).deep.equals([
			'https://fonts.googleapis.com/css2?family=Pacifico:ital,wght@0,400&display=swap'
		]);

		editor.destruct();
		editor = null;

		expect(fontLinks()).deep.equals([]);
	});

	it('Should show the names of the Google fonts in view in their fonts', async () => {
		make('<p>a</p>');

		const popup = open();
		await delay(200);

		const abeezee = Array.from(
			popup.querySelectorAll('.jodit-ui-font-picker__item')
		).find(item => item.textContent === 'ABeeZee');

		expect(abeezee.style.fontFamily.replace(/["']/g, '')).equals(
			'ABeeZee, sans-serif'
		);
		expect(fontLinks().find(link => link.includes('&text='))).matches(
			/[?&]family=ABeeZee&.*&text=AB[^&]*&display=swap$/
		);
	});
});
