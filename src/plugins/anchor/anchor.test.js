/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

// https://github.com/xdan/jodit/issues/1715
describe('Anchor plugin', () => {
	const insertAnchor = (editor, name) => {
		clickButton('anchor', editor);
		const popup = getOpenedPopup(editor);
		popup.querySelector('[ref=name_input]').value = name;
		simulateEvent('submit', popup.querySelector('form'));
		return popup;
	};

	const errorIn = popup =>
		popup.querySelector('.jodit-ui-input__error')?.textContent;

	const openAnchor = (editor, index = 0) => {
		simulateEvent('click', editor.editor.querySelectorAll('a')[index]);
		return getOpenedPopup(editor);
	};

	describe('Insert', () => {
		it('should have a button in the toolbar', () => {
			const editor = getJodit();
			expect(getButton('anchor', editor)).is.not.null;
		});

		it('should insert an anchor at the caret', () => {
			const editor = getJodit();
			editor.value = '<p>School fees|</p>';
			setCursorToChar(editor);

			insertAnchor(editor, 'fees');

			expect(editor.value).equals('<p>School fees<a id="fees"></a></p>');
		});

		it('should insert it at the start of selected text, leaving the text', () => {
			const editor = getJodit();
			editor.value = '<p>|School fees| for 2027</p>';
			setCursorToChar(editor);

			insertAnchor(editor, 'fees');

			expect(editor.value).equals(
				'<p><a id="fees"></a>School fees for 2027</p>'
			);
		});

		it('should drop a # typed before the name', () => {
			const editor = getJodit();
			editor.value = '<p>Fees|</p>';
			setCursorToChar(editor);

			insertAnchor(editor, '#fees');

			expect(editor.value).equals('<p>Fees<a id="fees"></a></p>');
		});

		it('should not insert a name with spaces, and say why', () => {
			const editor = getJodit();
			editor.value = '<p>Fees|</p>';
			setCursorToChar(editor);

			const popup = insertAnchor(editor, 'school fees');

			expect(editor.value).equals('<p>Fees</p>');
			expect(errorIn(popup)).equals('The name cannot contain spaces');
		});

		it('should not insert a name another element or anchor has, and say why', () => {
			const editor = getJodit();
			editor.value =
				'<h2 id="fees">Fees</h2><p><a name="uniform"></a>Uniform|</p>';
			setCursorToChar(editor);

			const popup = insertAnchor(editor, 'fees');
			expect(errorIn(popup)).equals('This name is already in use');

			popup.querySelector('[ref=name_input]').value = 'uniform';
			simulateEvent('submit', popup.querySelector('form'));
			expect(errorIn(popup)).equals('This name is already in use');

			expect(editor.value).equals(
				'<h2 id="fees">Fees</h2><p><a name="uniform"></a>Uniform</p>'
			);
		});

		it('should not insert an anchor without a name', () => {
			const editor = getJodit();
			editor.value = '<p>Fees|</p>';
			setCursorToChar(editor);

			const popup = insertAnchor(editor, ' ');

			expect(editor.value).equals('<p>Fees</p>');
			expect(errorIn(popup)).is.ok;
		});

		it('should not insert an anchor named only #, and say why', () => {
			const editor = getJodit();
			editor.value = '<p>Fees|</p>';
			setCursorToChar(editor);

			const popup = insertAnchor(editor, '#');

			expect(editor.value).equals('<p>Fees</p>');
			expect(errorIn(popup)).equals('Please fill out this field');
		});
	});

	describe('In the editor', () => {
		it('should make anchors uneditable in the editor only', () => {
			const editor = getJodit();
			const value = '<p>A<a id="x"></a>B<a name="y"></a>C</p>';
			editor.value = value;

			editor.editor.querySelectorAll('a').forEach(anchor => {
				expect(anchor.getAttribute('contenteditable')).equals('false');
			});
			expect(editor.value).equals(value);
		});

		it("should take the editor's attribute off anchors only, wherever it sits", () => {
			const editor = getJodit();
			const kept =
				'<span contenteditable="false">C</span><a href="#y" contenteditable="false">D</a>';
			editor.value = `<p>A<a class="x" name="y" title="t"></a>B<a contenteditable="false" id="z"></a>${kept}</p>`;

			expect(
				editor.editor.querySelector('a').getAttribute('contenteditable')
			).equals('false');
			expect(editor.value).equals(
				`<p>A<a class="x" name="y" title="t"></a>B<a id="z"></a>${kept}</p>`
			);
		});

		it('should leave links, and named links holding text, as they were', () => {
			const editor = getJodit();
			editor.value =
				'<p><a href="#x">Go</a> <a name="top">Top</a> <a id="z" href="#">Z</a></p>';

			editor.editor.querySelectorAll('a').forEach(anchor => {
				expect(anchor.hasAttribute('contenteditable')).is.false;
			});
		});

		it('should mark an anchor where it is, in the editing area only', () => {
			const editor = getJodit();
			editor.value = '<p>A<a id="x"></a>B</p>';

			const marker = editor.ew.getComputedStyle(
				editor.editor.querySelector('a'),
				'::before'
			);
			expect(parseFloat(marker.width)).is.above(0);
		});

		it('should mark an anchor in iframe mode', () => {
			const editor = getJodit({ iframe: true });
			editor.value = '<p>A<a id="x"></a>B</p>';

			const marker = editor.ew.getComputedStyle(
				editor.editor.querySelector('a'),
				'::before'
			);
			expect(parseFloat(marker.width)).is.above(0);
		});

		it('should keep the value through the source view', () => {
			const editor = getJodit();
			const value = '<p>A<a id="x"></a>B</p>';
			editor.value = value;

			editor.setMode(Jodit.MODE_SOURCE);
			expect(editor.getElementValue()).equals(value);

			editor.setMode(Jodit.MODE_WYSIWYG);
			expect(editor.value).equals(value);
			expect(
				editor.editor.querySelector('a').getAttribute('contenteditable')
			).equals('false');
		});
	});

	describe('Popup', () => {
		it('should open on a click on an anchor, with its name, instead of the link toolbar', () => {
			const editor = getJodit();
			editor.value = '<p>A<a id="fees"></a>B</p>';

			const popup = openAnchor(editor);

			expect(popup.querySelector('[ref=name_input]').value).equals(
				'fees'
			);
			expect(getButton('eye', popup)).is.null;
		});

		it("should open one anchor's popup after another's, and a link's toolbar after", () => {
			const editor = getJodit();
			editor.value =
				'<p>A<a id="fees"></a>B<a id="uniform"></a>C <a href="#fees">Go</a></p>';

			openAnchor(editor, 0);
			let popup = openAnchor(editor, 1);

			expect(popup.querySelectorAll('[ref=name_input]').length).equals(1);
			expect(popup.querySelector('[ref=name_input]').value).equals(
				'uniform'
			);

			popup = openAnchor(editor, 2);

			expect(popup.querySelector('[ref=name_input]')).is.null;
			expect(getButton('eye', popup)).is.not.null;
		});

		it("should open an anchor's form alone after a link's toolbar", () => {
			const editor = getJodit();
			editor.value = '<p><a href="#top">Top</a> A<a id="fees"></a>B</p>';

			openAnchor(editor, 0);
			const popup = openAnchor(editor, 1);

			expect(popup.querySelector('[ref=name_input]').value).equals(
				'fees'
			);
			expect(getButton('eye', popup)).is.null;
		});

		it('should open with the name it has, after a change left unsaved', () => {
			const editor = getJodit();
			editor.value = '<p>A<a id="fees"></a>B</p>';

			let popup = openAnchor(editor);
			popup.querySelector('[ref=name_input]').value = 'school-fees';
			simulateEvent('click', editor.editor.querySelector('p'));

			popup = openAnchor(editor);

			expect(popup.querySelector('[ref=name_input]').value).equals(
				'fees'
			);
			expect(editor.value).equals('<p>A<a id="fees"></a>B</p>');
		});

		it('should close on Escape, leaving the anchor as it was', () => {
			const editor = getJodit();
			editor.value = '<p>A<a id="fees"></a>B</p>';

			const popup = openAnchor(editor);
			const input = popup.querySelector('[ref=name_input]');
			input.value = 'school-fees';
			simulateEvent('keydown', input, options => {
				options.key = 'Escape';
			});

			expect(popup.getClientRects().length).equals(0);
			expect(editor.value).equals('<p>A<a id="fees"></a>B</p>');
		});

		it('should open the link toolbar for an anchor with the plugin off', () => {
			const editor = getJodit({ disablePlugins: ['anchor'] });
			editor.value = '<p>A<a id="fees"></a>B</p>';

			const popup = openAnchor(editor);

			expect(getButton('eye', popup)).is.not.null;
		});

		it('should rename an anchor and the links to it, as one history step', () => {
			const editor = getJodit({ history: { timeout: 0 } });
			const value =
				'<p><a href="#fees">See the fees</a></p><p><a id="fees"></a>Fees</p>';
			editor.value = value;

			const popup = openAnchor(editor, 1);
			popup.querySelector('[ref=name_input]').value = 'school-fees';
			simulateEvent('submit', popup.querySelector('form'));

			expect(editor.value).equals(
				'<p><a href="#school-fees">See the fees</a></p><p><a id="school-fees"></a>Fees</p>'
			);

			editor.execCommand('undo');
			expect(editor.value).equals(value);
		});

		it('should leave the links alone when renaming a copy of an anchor', () => {
			const editor = getJodit();
			editor.value =
				'<p><a href="#fees">See the fees</a></p><p><a id="fees"></a>Fees</p><p><a id="fees"></a>Fees</p>';

			const popup = openAnchor(editor, 2);
			popup.querySelector('[ref=name_input]').value = 'fees-2';
			simulateEvent('submit', popup.querySelector('form'));

			expect(editor.value).equals(
				'<p><a href="#fees">See the fees</a></p><p><a id="fees"></a>Fees</p><p><a id="fees-2"></a>Fees</p>'
			);
		});

		it("should keep an older anchor's name attribute", () => {
			const editor = getJodit();
			editor.value = '<p><a name="fees"></a>Fees</p>';

			const popup = openAnchor(editor);
			popup.querySelector('[ref=name_input]').value = 'school-fees';
			simulateEvent('submit', popup.querySelector('form'));

			expect(editor.value).equals(
				'<p><a name="school-fees"></a>Fees</p>'
			);
		});

		it('should keep the name an anchor already has', () => {
			const editor = getJodit();
			editor.value = '<p><a id="fees"></a>Fees</p>';

			const popup = openAnchor(editor);
			simulateEvent('submit', popup.querySelector('form'));

			expect(errorIn(popup)).is.not.ok;
			expect(editor.value).equals('<p><a id="fees"></a>Fees</p>');
		});

		it('should remove an anchor', () => {
			const editor = getJodit();
			editor.value = '<p>A<a id="fees"></a>B</p>';

			const popup = openAnchor(editor);
			clickButton('remove', popup);

			expect(editor.value).equals('<p>AB</p>');
		});
	});

	describe('Readonly', () => {
		const VALUE = '<p>A<a id="fees"></a>B</p>';
		const isOpen = popup =>
			Boolean(popup.isConnected && popup.getClientRects().length);

		it('should not open its popup on a click on an anchor', () => {
			const editor = getJodit({ readonly: true });
			editor.value = VALUE;

			const asked = [];
			editor.e.on('showPopup', (elm, bound, type) => asked.push(type));

			// A readonly editor passes no clicks on, so this stands in for one
			editor.e.fire('clickA', editor.editor.querySelector('a'));

			expect(asked).deep.equals([]);
			expect(getOpenedPopup(editor)).is.null;
		});

		it('should not insert an anchor from a form left open, closing it', () => {
			const editor = getJodit();
			editor.value = '<p>A<a id="fees"></a>B|</p>';
			setCursorToChar(editor);

			clickButton('anchor', editor);
			const popup = getOpenedPopup(editor);
			editor.setReadOnly(true);
			popup.querySelector('[ref=name_input]').value = 'uniform';
			simulateEvent('submit', popup.querySelector('form'));

			expect(editor.value).equals(VALUE);
			expect(isOpen(popup)).is.false;
		});

		it('should not rename or remove an anchor from its form left open, closing it', () => {
			const editor = getJodit();
			editor.value = VALUE;

			let popup = openAnchor(editor);
			editor.setReadOnly(true);
			popup.querySelector('[ref=name_input]').value = 'uniform';
			simulateEvent('submit', popup.querySelector('form'));

			expect(editor.value).equals(VALUE);
			expect(isOpen(popup)).is.false;

			editor.setReadOnly(false);
			popup = openAnchor(editor);
			editor.setReadOnly(true);
			clickButton('remove', popup);

			expect(editor.value).equals(VALUE);
			expect(isOpen(popup)).is.false;
		});
	});
});
