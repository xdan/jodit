/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Test editor indent plugin', function () {
	describe('Indent', function () {
		describe('Exec Indent command several times', function () {
			it('Should increase margin-left', function () {
				const editor = getJodit();
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

			describe('For RTL direction', function () {
				it('Should increase margin-right', function () {
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

	it('should indent multi-line selection of various child elements only on 1st 2 lines', function () {
		const editor = getJodit();
		editor.value = `
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. <i>Quonam, inquit, modo?</i> <span>prima quaeque bene</span>
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
		const el1Child = el1.querySelector('i');
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

	it('should indent multi-line selection of "dd" and "dt" child elements only on 1st 2 dt/dd groups', function () {
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

	describe('If selection element outside the editor', function () {
		it('should do nothing', function () {
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
});
