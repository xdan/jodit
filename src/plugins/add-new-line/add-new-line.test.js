/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Add new Line plugin', function () {
	it('Should not add a new line element in container before first use', function () {
		const editor = getJodit();
		expect(
			editor.container.querySelectorAll('.jodit-add-new-line').length
		).equals(0);
	});

	const moveCursorUnder = function (editor, elm) {
		simulateEvent('mousemove', 0, editor.editor, function (e) {
			const pos = Jodit.modules.Helpers.position(elm, editor);

			e.clientX = pos.left + 5;
			e.clientY = pos.top + 5;
		});
	};

	it('Should show .jodit-add-new-line after user moves mouse under Table, Ifrmae or IMG ', function () {
		const editor = getJodit();
		editor.value =
			'<table>' +
			'<tbody>' +
			'<tr><td>1</td></tr>' +
			'<tr><td>2</td></tr>' +
			'<tr><td>3</td></tr>' +
			'<tr><td>4</td></tr>' +
			'</tbody>' +
			'</table>';

		window.scrollTo(
			0,
			Jodit.modules.Helpers.offset(
				editor.editor,
				editor,
				editor.ownerDocument
			).top
		); // elementFromPoint works only with visible part of view

		moveCursorUnder(editor, editor.editor.firstChild);

		const newline = editor.container.querySelector('.jodit-add-new-line');

		expect(newline).not.is.null;
		expect(editor.ownerWindow.getComputedStyle(newline).display).equals(
			'block'
		);
	});

	it('Should add a new paragraph after user clicked on newline ', function () {
		const editor = getJodit();
		editor.value =
			'<table><tbody>' +
			'<tr><td>2</td></tr>' +
			'<tr><td>2</td></tr>' +
			'<tr><td>3</td></tr>' +
			'<tr><td>4</td></tr>' +
			'</tbody></table>';

		window.scrollTo(
			0,
			Jodit.modules.Helpers.offset(
				editor.editor,
				editor,
				editor.ownerDocument
			).top
		); // elementFromPoint works only with visible part of view

		moveCursorUnder(editor, editor.editor.firstChild);

		const newline = editor.container.querySelector('.jodit-add-new-line');

		expect(newline).not.is.null;
		expect(editor.ownerWindow.getComputedStyle(newline).display).equals(
			'block'
		);

		simulateEvent('mousedown', 0, newline.querySelector('span'));
		expect(editor.getElementValue()).equals(
			'<p></p><table><tbody>' +
				'<tr><td>2</td></tr>' +
				'<tr><td>2</td></tr>' +
				'<tr><td>3</td></tr>' +
				'<tr><td>4</td></tr>' +
				'</tbody></table>'
		);
	});

	it('Should add new paragraph after user clicked on newline below table', function () {
		const editor = getJodit();
		editor.value =
			'<table><tbody>' +
			'<tr><td>3</td></tr>' +
			'<tr><td>2</td></tr>' +
			'</tbody></table>';

		window.scrollTo(
			0,
			Jodit.modules.Helpers.offset(
				editor.editor,
				editor,
				editor.ownerDocument
			).top
		); // elementFromPoint works only with visible part of view

		simulateEvent('mousemove', 0, editor.editor, function (data) {
			const pos = Jodit.modules.Helpers.position(
				editor.editor.firstChild,
				editor
			);

			data.clientX = pos.left + 5;
			data.clientY = pos.top + (pos.height - 5);
		});

		const newline = editor.container.querySelector('.jodit-add-new-line');

		expect(newline).not.is.null;
		expect(editor.ownerWindow.getComputedStyle(newline).display).equals(
			'block'
		);

		simulateEvent('mousedown', 0, newline.querySelector('span'));
		expect(editor.getElementValue()).equals(
			'<table><tbody>' +
				'<tr><td>3</td></tr>' +
				'<tr><td>2</td></tr>' +
				'</tbody></table><p></p>'
		);
	});

	it('Should add a new paragraph after user clicked on newline below table in IFRAME mode', function () {
		const editor = getJodit({
			ifarme: true
		});
		editor.value =
			'<table><tbody>' +
			'<tr><td>3</td></tr>' +
			'<tr><td>2</td></tr>' +
			'</tbody></table>';

		window.scrollTo(
			0,
			Jodit.modules.Helpers.offset(
				editor.editor,
				editor,
				editor.ownerDocument
			).top
		); // elementFromPoint works only with visible part of view

		simulateEvent('mousemove', 0, editor.editor, function (data) {
			const pos = Jodit.modules.Helpers.position(
				editor.editor.firstChild,
				editor
			);

			data.clientX = pos.left + 5;
			data.clientY = pos.top + (pos.height - 5);
		});

		const newline = editor.container.querySelector('.jodit-add-new-line');

		expect(newline).not.is.null;
		expect(editor.ownerWindow.getComputedStyle(newline).display).equals(
			'block'
		);

		simulateEvent('mousedown', 0, newline.querySelector('span'));
		expect(editor.getElementValue()).equals(
			'<table><tbody>' +
				'<tr><td>3</td></tr>' +
				'<tr><td>2</td></tr>' +
				'</tbody></table><p></p>'
		);
	});

	describe('Insert line on top of an IMG element that was inside a P element', function () {
		it('Should insert new P before a parent P element', function () {
			const editor = getJodit();
			editor.value =
				'<p><img src="tests/artio.jpg" style="width: 100px; height: 100px;" alt=""></p>';

			window.scrollTo(
				0,
				Jodit.modules.Helpers.offset(
					editor.editor,
					editor,
					editor.ownerDocument
				).top
			); // elementFromPoint works only with visible part of view

			const img = editor.editor.querySelector('img');
			expect(null).does.not.equal(img);

			moveCursorUnder(editor, img);

			const newline = editor.container.querySelector(
				'.jodit-add-new-line'
			);

			expect(null).does.not.equal(newline);
			expect(editor.ownerWindow.getComputedStyle(newline).display).equals(
				'block'
			);
			simulateEvent('mousedown', 0, newline.querySelector('span'));

			editor.s.insertHTML('stop');

			expect(
				'<p>stop</p><p><img alt="" src="tests/artio.jpg" style="height:100px;width:100px"></p>'
			).equals(sortAttributes(editor.value));
		});
	});
	describe('Arrow keys next to an embed at the edge of the content (#1729)', function () {
		const embed =
			'<p><iframe src="https://www.youtube.com/embed/3JZ_D3ELwOQ"></iframe></p>';

		// The value before the key, with `|` placed
		const load = (source, options) => {
			const editor = getJodit(options);
			editor.value = source;
			setCursorToChar(editor);
			return [editor, editor.value];
		};

		[
			[`<p>One|</p>${embed}`, 'ArrowDown', true],
			[`<p>One|</p>${embed}`, 'ArrowRight', true],
			[`${embed}<p>|One</p>`, 'ArrowUp', false],
			[`${embed}<p>|One</p>`, 'ArrowLeft', false]
		].forEach(([source, key, after]) => {
			it(`Should add a line ${after ? 'after' : 'before'} the embed: ${key} in ${source}`, async function () {
				const [editor, before] = load(source);

				simulateEvent('keydown', key, editor.editor);
				await delay(20);
				editor.s.insertHTML('X');

				expect(editor.value).equals(
					after ? before + '<p>X</p>' : '<p>X</p>' + before
				);
			});
		});

		it('Should not add one when the browser moved the caret', async function () {
			const [editor, before] = load(`<p>One|</p>${embed}<p>Two</p>`);

			simulateEvent('keydown', 'ArrowDown', editor.editor);
			// As the browser does, past the embed to the line after it
			editor.s.setCursorIn(editor.editor.lastChild);
			await delay(20);

			expect(editor.value).equals(before);
		});

		[
			['<p>One</p><p>Two|</p>', {}],
			[`<p>One|</p>${embed}`, { shiftKey: true }],
			[`<p>One|</p>${embed}`, {}, { addNewLine: false }]
		].forEach(([source, modifiers, options]) => {
			it(`Should leave ${source} alone on ArrowDown${modifiers.shiftKey ? ' with Shift' : ''}${options ? ' with addNewLine off' : ''}`, async function () {
				const [editor, before] = load(source, options);

				simulateEvent(
					'keydown',
					'ArrowDown',
					editor.editor,
					() => modifiers
				);
				await delay(20);

				expect(editor.value).equals(before);
			});
		});
	});
});
