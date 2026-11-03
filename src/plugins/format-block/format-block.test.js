/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Format block plugin', () => {
	describe('Previews in the list take the content styles (#1710)', () => {
		const previewStyle = (editor, tag) => {
			clickTrigger('paragraph', editor);
			return window.getComputedStyle(
				getOpenedPopup(editor).querySelector(tag)
			);
		};

		describe('In iframe mode', () => {
			it("Should take the font, colour, capitals, spacing and smoothing of the content's heading, but not its size or margins", () => {
				const editor = getJodit({
					iframe: true,
					iframeStyle:
						'h2 { font-family: Georgia, serif; font-style: italic; font-weight: 300; color: rgb(200, 0, 0); text-transform: uppercase; letter-spacing: 0.1em; text-decoration: underline; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; font-size: 80px; margin: 50px; }'
				});
				editor.value = '<p>text</p>';

				const style = previewStyle(editor, 'h2');

				expect(style.fontFamily).equals('Georgia, serif');
				expect(style.fontStyle).equals('italic');
				expect(style.fontWeight).equals('300');
				expect(style.color).equals('rgb(200, 0, 0)');
				expect(style.textTransform).equals('uppercase');
				expect(style.textDecorationLine).equals('underline');
				['-webkit-font-smoothing', '-moz-osx-font-smoothing']
					.filter(prop => CSS.supports(prop, 'auto'))
					.forEach(prop =>
						expect(style.getPropertyValue(prop)).does.not.equal(
							'auto'
						)
					);
				expect(
					getOpenedPopup(editor)
						.querySelector('h2')
						.getAttribute('style')
				).does.not.match(/:(;|$)/);
				expect(style.fontSize).does.not.equal('80px');
				expect(style.marginTop).equals('0px');
				expect(
					parseFloat(style.letterSpacing) / parseFloat(style.fontSize)
				).to.be.closeTo(0.1, 0.01);
				expect(editor.value).equals('<p>text</p>');
			});
		});

		describe('Without an iframe, with styles for the editing area', () => {
			let css;

			beforeEach(() => {
				css = document.createElement('style');
				css.textContent =
					'.jodit-wysiwyg h3 { font-family: "Courier New", monospace; color: rgb(0, 128, 0); }';
				document.head.appendChild(css);
			});

			afterEach(() => {
				css.remove();
			});

			it("Should take the area's styles for the heading", () => {
				const editor = getJodit();
				editor.value = '<p>text</p>';

				const style = previewStyle(editor, 'h3');

				expect(style.fontFamily.replace(/"/g, '')).equals(
					'Courier New, monospace'
				);
				expect(style.color).equals('rgb(0, 128, 0)');
				expect(editor.value).equals('<p>text</p>');
			});
		});

		describe('Option formatBlock.previewProperties', () => {
			const iframeStyle =
				'h2 { font-family: Georgia, serif; color: rgb(200, 0, 0); }';

			it('Should copy only the properties it lists', () => {
				const editor = getJodit({
					iframe: true,
					iframeStyle,
					formatBlock: { previewProperties: Jodit.atom(['color']) }
				});
				editor.value = '<p>text</p>';

				const style = previewStyle(editor, 'h2');

				expect(style.color).equals('rgb(200, 0, 0)');
				expect(style.fontFamily).does.not.equal('Georgia, serif');
			});

			it("Should keep the toolbar's styles when it's empty", () => {
				const editor = getJodit({
					iframe: true,
					iframeStyle,
					formatBlock: { previewProperties: Jodit.atom([]) }
				});
				editor.value = '<p>text</p>';

				const style = previewStyle(editor, 'h2');

				expect(style.color).does.not.equal('rgb(200, 0, 0)');
				expect(style.fontFamily).does.not.equal('Georgia, serif');
				expect(
					getOpenedPopup(editor)
						.querySelector('h2')
						.getAttribute('style')
				).equals('margin:0;padding:0');
			});
		});

		describe("The content's web fonts", () => {
			const fontFace =
				'@font-face { font-family: JoditPreviewFont; src: url("fonts/preview.woff2"); font-weight: 600; }';
			const heading = 'h2 { font-family: JoditPreviewFont, serif; }';

			const familyName = face => face.family.replace(/["']/g, '');
			const carried = () =>
				Array.from(document.fonts).filter(face =>
					/^jodit-preview-\d+-joditpreviewfont$/.test(
						familyName(face)
					)
				);

			const settle = () =>
				new Promise(resolve => setTimeout(resolve, 20));

			let OriginalFontFace, sources;

			beforeEach(() => {
				OriginalFontFace = window.FontFace;
				sources = [];
				window.FontFace = function (family, source, descriptors) {
					sources.push(source);
					return new OriginalFontFace(family, source, descriptors);
				};
			});

			afterEach(() => {
				window.FontFace = OriginalFontFace;
			});

			it('Should be added to the page under a name only the editor uses, with absolute URLs, and taken out with the editor', async () => {
				const editor = getJodit({
					iframe: true,
					iframeStyle: fontFace + heading
				});
				editor.value = '<p>text</p>';

				const style = previewStyle(editor, 'h2');
				await settle();

				expect(carried()).has.length(1);
				expect(carried()[0].weight).equals('600');
				expect(sources).deep.equals([
					`url("${new URL('fonts/preview.woff2', document.baseURI).href}")`
				]);
				expect(
					Array.from(document.fonts).filter(
						face => familyName(face) === 'JoditPreviewFont'
					)
				).has.length(0);

				expect(style.fontFamily.replace(/["']/g, '')).matches(
					/^jodit-preview-\d+-joditpreviewfont, JoditPreviewFont, serif$/
				);

				editor.destruct();
				expect(carried()).has.length(0);
			});

			it("Should leave the names of fonts the content doesn't load alone", () => {
				const editor = getJodit({
					iframe: true,
					iframeStyle:
						fontFace + 'h2 { font-family: Georgia, serif; }'
				});
				editor.value = '<p>text</p>';

				expect(previewStyle(editor, 'h2').fontFamily).equals(
					'Georgia, serif'
				);
			});

			it('Should add fonts that arrive after the list first opened, the next time it opens', async () => {
				const editor = getJodit({ iframe: true, iframeStyle: heading });
				editor.value = '<p>text</p>';

				previewStyle(editor, 'h2');
				await settle();
				expect(carried()).has.length(0);

				const late = editor.ed.createElement('style');
				late.textContent = fontFace;
				editor.ed.head.appendChild(late);

				clickTrigger('paragraph', editor);
				previewStyle(editor, 'h2');
				await settle();

				expect(carried()).has.length(1);
			});

			describe('Without an iframe', () => {
				let css;

				beforeEach(() => {
					css = document.createElement('style');
					css.textContent = fontFace + `.jodit-wysiwyg ${heading}`;
					document.head.appendChild(css);
				});

				afterEach(() => {
					css.remove();
				});

				it('Should leave the page alone, as it has them already', async () => {
					const editor = getJodit();
					editor.value = '<p>text</p>';

					const style = previewStyle(editor, 'h2');
					await settle();

					expect(style.fontFamily).equals('JoditPreviewFont, serif');
					expect(sources).has.length(0);
					expect(carried()).has.length(0);
				});
			});
		});
	});

	// https://github.com/xdan/jodit/issues/1063
	describe('Apply a heading to a block with conflicting inline styles', () => {
		const STYLED_H1 =
			'<h1 style="color: rgb(23, 43, 77); font-size: 24px; font-weight: normal; line-height: 1.25;">Q1Fy25</h1>';

		describe('With selection', () => {
			it('Should change the tag and drop the conflicting font styles', () => {
				const editor = getJodit({ history: { timeout: 0 } });
				editor.value = STYLED_H1;
				editor.s.select(editor.editor.querySelector('h1'), true);

				editor.execCommand('formatblock', false, 'h2');

				expect(sortAttributes(editor.value)).equals(
					'<h2 style="color:#172B4D;line-height:1.25">Q1Fy25</h2>'
				);
			});
		});

		describe('With collapsed cursor', () => {
			it('Should change the tag and drop the conflicting font styles', () => {
				const editor = getJodit({ history: { timeout: 0 } });
				editor.value = STYLED_H1;
				editor.s.setCursorIn(editor.editor.querySelector('h1'));

				editor.execCommand('formatblock', false, 'h2');

				expect(sortAttributes(editor.value)).equals(
					'<h2 style="color:#172B4D;line-height:1.25">Q1Fy25</h2>'
				);
			});
		});

		describe('Regular paragraph without conflicting styles', () => {
			it('Should simply change the tag', () => {
				const editor = getJodit({ history: { timeout: 0 } });
				editor.value = '<p>text</p>';
				editor.s.select(editor.editor.querySelector('p'), true);

				editor.execCommand('formatblock', false, 'h1');

				expect(editor.value).equals('<h1>text</h1>');
			});
		});
	});

	describe('Apply a heading in an empty table cell (#1608)', () => {
		const CELL = '<table><tbody><tr><td><br></td></tr></tbody></table>';
		const HEADING =
			'<table><tbody><tr><td><h1><br></h1></td></tr></tbody></table>';

		[
			[CELL, HEADING],
			['<table><tbody><tr><td></td></tr></tbody></table>', HEADING],
			['<ul><li><br></li></ul>', '<ul><li><h1><br></h1></li></ul>']
		].forEach(([value, expected]) => {
			describe(`With the cursor in ${value}`, () => {
				it('Should give the heading one BR', () => {
					const editor = getJodit({ history: { timeout: 0 } });
					editor.value = value;
					editor.s.setCursorIn(editor.editor.querySelector('td, li'));

					editor.execCommand('formatblock', false, 'h1');

					expect(editor.value).equals(expected);
				});
			});
		});

		describe('With the contents of the cell selected', () => {
			it('Should give the heading one BR', () => {
				const editor = getJodit({ history: { timeout: 0 } });
				editor.value = CELL;
				editor.s.select(editor.editor.querySelector('td'), true);

				editor.execCommand('formatblock', false, 'h1');

				expect(editor.value).equals(HEADING);
			});
		});

		describe('With a list button', () => {
			[
				['insertUnorderedList', 'ul'],
				['insertOrderedList', 'ol']
			].forEach(([command, tag]) => {
				it(`Should give the list item one BR after ${command}`, () => {
					const editor = getJodit({ history: { timeout: 0 } });
					editor.value = CELL;
					editor.s.setCursorIn(editor.editor.querySelector('td'));

					editor.execCommand(command);

					expect(editor.value).equals(
						`<table><tbody><tr><td><${tag}><li><br></li></${tag}></td></tr></tbody></table>`
					);
				});
			});
		});
	});
});
