/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Test editor indent plugin', () => {
	describe('Indent', () => {
		describe('Exec Indent command several times', () => {
			it('Should increase margin-left', () => {
				const editor = getJodit();
				editor.value = '<ul><li>|test</li></ul>';

				setCursorToChar(editor);

				editor.execCommand('indent');
				expect(editor.value).equals(
					'<ul><li style="margin-left: 10px;">test</li></ul>'
				);

				editor.execCommand('indent');
				expect(editor.value).equals(
					'<ul><li style="margin-left: 20px;">test</li></ul>'
				);
				editor.execCommand('indent');
				expect(editor.value).equals(
					'<ul><li style="margin-left: 30px;">test</li></ul>'
				);
				editor.execCommand('outdent');
				expect(editor.value).equals(
					'<ul><li style="margin-left: 20px;">test</li></ul>'
				);
			});

			describe('Inside table cell', () => {
				it('Should increase padding-left', () => {
					const editor = getJodit();
					editor.value =
						'<table><tbody><tr><td>|test</td></tr></tbody></table>';
					setCursorToChar(editor);

					editor.execCommand('indent');
					expect(sortAttributes(editor.value)).equals(
						'<table><tbody><tr><td style="padding-left:10px">test</td></tr></tbody></table>'
					);

					editor.execCommand('indent');
					expect(sortAttributes(editor.value)).equals(
						'<table><tbody><tr><td style="padding-left:20px">test</td></tr></tbody></table>'
					);

					editor.execCommand('outdent');
					expect(sortAttributes(editor.value)).equals(
						'<table><tbody><tr><td style="padding-left:10px">test</td></tr></tbody></table>'
					);

					editor.execCommand('outdent');
					expect(sortAttributes(editor.value)).equals(
						'<table><tbody><tr><td>test</td></tr></tbody></table>'
					);
				});
			});

			describe('For RTL direction', () => {
				it('Should increase margin-right', () => {
					const editor = getJodit({
						direction: 'rtl'
					});
					editor.value = '<ul><li>test</li></ul>';

					const range = editor.s.createRange();
					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.collapse(true);
					editor.s.selectRange(range);

					editor.execCommand('indent');
					expect(editor.value).equals(
						'<ul><li style="margin-right: 10px;">test</li></ul>'
					);

					editor.execCommand('indent');
					expect(editor.value).equals(
						'<ul><li style="margin-right: 20px;">test</li></ul>'
					);
					editor.execCommand('indent');
					expect(editor.value).equals(
						'<ul><li style="margin-right: 30px;">test</li></ul>'
					);
					editor.execCommand('outdent');
					expect(editor.value).equals(
						'<ul><li style="margin-right: 20px;">test</li></ul>'
					);
				});
			});
		});
	});

	it('should indent multi-line selection of various child elements only on 1st 2 lines', () => {
		const editor = getJodit();
		editor.value = `
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. <em>Quonam, inquit, modo?</em> <span>prima quaeque bene</span>
    </p>
    <blockquote cite="http://loripsum.net">
      Nec enim absolvi beata vita sapientis neque ad exitum perduci poterit, si prima quaeque bene ab eo consulta atque facta ipsius oblivione obruentur.
    </blockquote>
    <pre>
      Tum ille: Tu autem cum ipse tantum librorum habeas, quos hic tandem requiris?
    </pre>
    `;

		const children =
			editor.container.querySelector('.jodit-wysiwyg').children;
		const el1 = children[0];
		const el1Child = el1.querySelector('em');
		const el2 = children[1];
		const el3 = children[2];

		const sel = editor.s.sel,
			range = editor.s.createRange();

		range.setStart(el1Child, 0);
		range.setEnd(el2, 1);

		sel.removeAllRanges();
		sel.addRange(range);

		editor.execCommand('indent');

		expect(el1.style.marginLeft).equals('10px');
		expect(el2.style.marginLeft).equals('10px');
		expect(el3.style.marginLeft).equals('');
	});

	it('should indent multi-line selection of "dd" and "dt" child elements only on 1st 2 dt/dd groups', () => {
		const editor = getJodit();
		editor.value = `
    <dl>
      <dt><dfn>Falli igitur possumus.</dfn></dt>
      <dd>Quid enim ab antiquis ex eo genere, quod ad disserendum valet, praetermissum est?</dd>

      <dt><dfn>Scrupulum, inquam, abeunti;</dfn></dt>
      <dd>Scio enim esse quosdam, qui quavis lingua philosophari possint;</dd>

      <dt><dfn>Poterat autem inpune;</dfn></dt>
      <dd>Tum ille: Tu autem cum ipse tantum librorum habeas, quos hic tandem requiris?</dd>
    </dl>
    `;

		const children = editor.container.querySelectorAll(
			'.jodit-wysiwyg dt,.jodit-wysiwyg dd'
		);

		const el1 = children[0];
		const el2 = children[1];
		const el3 = children[2];
		const el4 = children[3];
		const el5 = children[4];
		const el6 = children[5];

		const sel = editor.s.sel,
			range = editor.s.createRange();

		range.setStart(el1, 0);
		range.setEnd(el4, 1);

		sel.removeAllRanges();
		sel.addRange(range);

		editor.execCommand('indent');

		expect(el1.style.marginLeft).equals('10px');
		expect(el2.style.marginLeft).equals('10px');
		expect(el3.style.marginLeft).equals('10px');
		expect(el4.style.marginLeft).equals('10px');
		expect(el5.style.marginLeft).equals('');
		expect(el6.style.marginLeft).equals('');
	});

	describe('If selection element outside the editor', () => {
		it('should do nothing', () => {
			const editor = getJodit(),
				div = appendTestDiv();
			editor.value = 'test';

			div.innerHTML = 'text';

			const range = editor.s.createRange();

			range.setStart(div.firstChild, 0);
			range.setEnd(div.firstChild, 1);

			editor.s.selectRange(range);

			editor.execCommand('indent');

			expect(div.style.marginLeft).does.not.equals('10px');
		});
	});

	describe('Indent plugin', () => {
		it('Should set active outdent button if current container has marginLeft', () => {
			const area = appendTestArea();
			const editor = new Jodit(area, {
				toolbarAdaptive: false,
				buttons: 'indent,outdent'
			});

			editor.value = '<p>|text</p>';
			setCursorToChar(editor);

			simulateEvent('mousedown', editor.editor.firstChild);

			expect(getButton('outdent', editor).hasAttribute('disabled')).is
				.true;

			editor.editor.firstChild.style.marginLeft = '100px';

			simulateEvent('mousedown', editor.editor.firstChild);

			expect(getButton('outdent', editor).hasAttribute('disabled')).is
				.false;
		});

		describe('Press Indent button', () => {
			describe('With enter BR mode', () => {
				describe('Collapsed seelction', () => {
					[
						[
							'test<br>|text<br>some text again',
							'test<br><p style="margin-left: 10px;">text</p><br>some text again'
						],
						[
							'test<br>text<br>|some text again',
							'test<br>text<br><p style="margin-left: 10px;">some text again</p>'
						],
						[
							'|test<br>text<br>some text again',
							'<p style="margin-left: 10px;">test</p><br>text<br>some text again'
						]
					].forEach(([value, result]) => {
						describe(`For input: "${value}"`, () => {
							it('Should wrap current line in block and increase margin-left', () => {
								const editor = getJodit({
									enter: 'BR'
								});
								editor.value = value;

								setCursorToChar(editor);

								clickButton('indent', editor);

								expect(editor.value).equals(result);
							});
						});
					});
				});

				describe('Not collapsed seelction', () => {
					[
						[
							'test<br>|text<br>some text again|',
							'test<br><p style="margin-left: 10px;">text</p><p style="margin-left: 10px;"><br>some text again</p>'
						],
						[
							'test<br>|text|<br>some text again',
							'test<br><p style="margin-left: 10px;">text</p><br>some text again'
						]
					].forEach(([value, result]) => {
						describe(`For input: "${value}"`, () => {
							it('Should wrap lines selection in separated blocks and increase margin-left', () => {
								const editor = getJodit({
									enter: 'BR'
								});
								editor.value = value;

								setCursorToChar(editor);

								clickButton('indent', editor);

								expect(editor.value).equals(result);
							});
						});
					});
				});
			});

			describe('Several lines with <br> inside block', () => {
				it('Should just increase margin-left for whole block', () => {
					const editor = getJodit();
					editor.value = '<p>test<br>test<br>|test<br>test</p>';

					setCursorToChar(editor);

					clickButton('indent', editor);

					expect(editor.value).equals(
						'<p style="margin-left: 10px;">test<br>test<br>test<br>test</p>'
					);
				});
			});

			it('Should increase indent for current blocks', () => {
				const area = appendTestArea();
				const editor = new Jodit(area, {
					toolbarAdaptive: false,
					buttons: 'indent,outdent',
					indentMargin: 5
				});

				editor.value = '<h1>test</h1><p>text</p><p>text</p>';

				const range = editor.s.createRange();

				range.setStartBefore(editor.editor.firstChild);
				range.setEndAfter(editor.editor.firstChild.nextSibling);
				editor.s.selectRange(range);

				clickButton('indent', editor);
				clickButton('indent', editor);
				clickButton('indent', editor);

				expect(
					'<h1 style="margin-left: 15px;">test</h1><p style="margin-left: 15px;">text</p><p>text</p>'
				).equals(editor.value);

				clickButton('outdent', editor);
				clickButton('outdent', editor);
				clickButton('outdent', editor);

				expect('<h1>test</h1><p>text</p><p>text</p>').equals(
					editor.value
				);
			});
		});

		describe('Run indent command for inline elements', () => {
			it('should wrap elements in block and change margin for it', () => {
				const editor = getJodit();
				editor.value = '<p>a|<br>b<br>c<br></p>';
				setCursorToChar(editor);

				editor.execCommand('indent');

				expect(sortAttributes(editor.value)).equals(
					'<p style="margin-left:10px">a<br>b<br>c<br></p>'
				);
			});
		});
	});
});
