/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test insert plugins', function () {
	describe('hr', function () {
		it('Should insert horizontal line', function () {
			const editor = getJodit();
			editor.execCommand('insertHorizontalRule');
			editor.execCommand('insertHorizontalRule');
			editor.execCommand('insertHorizontalRule');
			expect(editor.value).equals('<hr><hr><hr><p><br></p>');
		});

		describe('Caret after the line (#1606)', function () {
			[
				['<p>One|</p>', '<p>One</p><hr><p>|<br></p>'],
				['<p>On|e</p>', '<p>On</p><hr><p>|e</p>'],
				['<p>|One</p>', '<hr><p>|One</p>'],
				['<p>One|</p><p>Two</p>', '<p>One</p><hr><p>|Two</p>'],
				['<ul><li>On|e</li></ul>', '<ul><li>On<hr>|e</li></ul>'],
				['<ul><li>One|</li></ul>', '<ul><li>One<hr>|</li></ul>'],
				[
					'<ul><li>One|</li><li>Two</li></ul>',
					'<ul><li>One<hr>|</li><li>Two</li></ul>'
				],
				[
					'<ul><li>On|e</li></ul><p>Next</p>',
					'<ul><li>On<hr>|e</li></ul><p>Next</p>'
				],
				['<ul><li>|<br></li></ul>', '<ul><li><hr>|</li></ul>'],
				[
					'<ul><li><p>One|</p></li></ul>',
					'<ul><li><p>One</p><hr><p>|<br></p></li></ul>'
				],
				[
					'<table><tbody><tr><td>a|1</td></tr></tbody></table>',
					'<table><tbody><tr><td>a<hr>|1</td></tr></tbody></table>'
				],
				[
					'<table><tbody><tr><td>|<br></td><td>b1</td></tr></tbody></table>',
					'<table><tbody><tr><td><hr>|<br></td><td>b1</td></tr></tbody></table>'
				],
				['<div class="box">|<br></div>', '<div class="box"><hr>|</div>']
			].forEach(([value, result]) => {
				it(`Should turn ${value} into ${result}`, function () {
					const editor = getJodit();
					editor.value = value;
					setCursorToChar(editor);
					editor.execCommand('insertHorizontalRule');
					replaceCursorToChar(editor);
					expect(sortAttributes(editor.value)).equals(result);
				});
			});
		});
	});
	describe('A horizontal line selected whole (#1802)', function () {
		// `[hr]` is a selected line, `|` the caret, and `^` a caret in the
		// editor itself, beside a line, where the browsers can leave it
		const make = (source, options) => {
			const editor = getJodit(options);
			const prefix = document.createElement('template');
			prefix.innerHTML = source
				.slice(0, Math.max(source.indexOf('^'), 0))
				.replace('|', '')
				.replace('[hr]', '<hr>');
			const offset = prefix.content.childNodes.length;

			editor.value = source
				.replace('^', '')
				.replace('[hr]', '<hr data-selected="">');

			const toRoot = () => {
				const range = editor.ed.createRange();
				range.setStart(editor.editor, offset);
				editor.s.selectRange(range);
			};

			const line = editor.editor.querySelector('[data-selected]');

			if (line) {
				line.removeAttribute('data-selected');
				editor.s.select(line);
			} else if (source.includes('|')) {
				setCursorToChar(editor);
			} else {
				toRoot();
			}

			return [editor, toRoot];
		};

		// The value, with the selected line as `[hr]` or the caret as `|`
		const state = editor => {
			const { range } = editor.s;
			const { startContainer: box, startOffset } = range;
			const value = () => editor.value.replace(/\uFEFF/g, '');

			if (range.collapsed) {
				range.insertNode(editor.createInside.text('|'));
				return value();
			}

			const line = box.childNodes[startOffset];

			expect(line.nodeName).equals('HR');
			expect(
				range.endContainer === box &&
					range.endOffset === startOffset + 1
			).is.true;

			const index = Array.from(
				editor.editor.querySelectorAll('hr')
			).indexOf(line);
			let n = 0;

			return value().replace(/<hr>/g, hr =>
				n++ === index ? '[hr]' : hr
			);
		};

		// Whether the editor leaves the key to the browser
		const press = (editor, combo) => {
			const key = combo.replace('Shift+', '');

			return simulateEvent('keydown', key, editor.editor, () => ({
				shiftKey: key !== combo
			}));
		};

		describe('Keys with a line selected', function () {
			[
				[
					'<p>Above</p>[hr]<p>Below</p>',
					'ArrowUp',
					'<p>Above|</p><hr><p>Below</p>'
				],
				[
					'<p>Above</p>[hr]<p>Below</p>',
					'ArrowLeft',
					'<p>Above|</p><hr><p>Below</p>'
				],
				[
					'<p>Above</p>[hr]<p>Below</p>',
					'ArrowDown',
					'<p>Above</p><hr><p>|Below</p>'
				],
				[
					'<p>Above</p>[hr]<p>Below</p>',
					'ArrowRight',
					'<p>Above</p><hr><p>|Below</p>'
				],
				[
					'<p>Above</p>[hr]<hr><p>Below</p>',
					'ArrowDown',
					'<p>Above</p><hr>[hr]<p>Below</p>'
				],
				[
					'<p>Above</p><hr>[hr]<p>Below</p>',
					'ArrowUp',
					'<p>Above</p>[hr]<hr><p>Below</p>'
				],
				['[hr]<p>Below</p>', 'ArrowUp', '<p>|<br></p><hr><p>Below</p>'],
				[
					'<p>Above</p>[hr]',
					'ArrowDown',
					'<p>Above</p><hr><p>|<br></p>'
				],
				[
					'<p>Above</p>[hr]<p>Below</p>',
					'Backspace',
					'<p>Above|</p><p>Below</p>'
				],
				[
					'<p>Above</p>[hr]<p>Below</p>',
					'Delete',
					'<p>Above</p><p>|Below</p>'
				],
				[
					'<p>Above</p>[hr]<hr><p>Below</p>',
					'Delete',
					'<p>Above</p>[hr]<p>Below</p>'
				],
				[
					'<p>Above</p><hr>[hr]<p>Below</p>',
					'Backspace',
					'<p>Above</p>[hr]<p>Below</p>'
				],
				['[hr]', 'Backspace', '<p>|<br></p>'],
				[
					'<p>Above</p>[hr]<p>Below</p>',
					'Enter',
					'<p>Above</p><hr><p>|<br></p><p>Below</p>'
				],
				[
					'<p>Above</p>[hr]<p>Below</p>',
					'Shift+Enter',
					'<p>Above</p><p>|<br></p><hr><p>Below</p>'
				]
			].forEach(([source, key, result]) => {
				it(`Should turn ${source} into ${result} with ${key}`, function () {
					const [editor] = make(source);

					expect(press(editor, key)).is.false;
					expect(state(editor)).equals(result);
				});
			});

			it('Should start a new line after the line for a letter, and leave the letter to the browser', function () {
				const [editor] = make('<p>Above</p>[hr]<p>Below</p>');

				expect(press(editor, 'x')).is.true;
				expect(state(editor)).equals(
					'<p>Above</p><hr><p>|<br></p><p>Below</p>'
				);
			});

			it('Should leave Shift and an arrow key to the browser', function () {
				const [editor] = make('<p>Above</p>[hr]<p>Below</p>');

				expect(press(editor, 'Shift+ArrowUp')).is.true;
				expect(state(editor)).equals('<p>Above</p>[hr]<p>Below</p>');
			});

			it('Should select the line again with Backspace after Enter', function () {
				const [editor] = make('<p>Above</p><hr>[hr]<hr><p>Below</p>');

				press(editor, 'Enter');
				press(editor, 'Backspace');
				expect(state(editor)).equals(
					'<p>Above</p><hr>[hr]<hr><p>Below</p>'
				);

				press(editor, 'ArrowUp');
				expect(state(editor)).equals(
					'<p>Above</p>[hr]<hr><hr><p>Below</p>'
				);
			});
		});

		describe('Arrow keys that come to a line', function () {
			[
				[
					'<p>Above</p><hr>^<p>|Below</p>',
					'ArrowUp',
					'<p>Above</p>[hr]<p>Below</p>'
				],
				[
					'<p>Above</p><hr>^<p>|Below</p>',
					'ArrowLeft',
					'<p>Above</p>[hr]<p>Below</p>'
				],
				[
					'<p>Above|</p>^<hr><p>Below</p>',
					'ArrowDown',
					'<p>Above</p>[hr]<p>Below</p>'
				],
				[
					'<p>Above|</p>^<hr><p>Below</p>',
					'ArrowRight',
					'<p>Above</p>[hr]<p>Below</p>'
				],
				[
					'<p>Above</p><hr><hr>^<p>|Below</p>',
					'ArrowUp',
					'<p>Above</p><hr>[hr]<p>Below</p>'
				],
				[
					'<h2>Above|</h2>^<hr><ul><li>Below</li></ul>',
					'ArrowDown',
					'<h2>Above</h2>[hr]<ul><li>Below</li></ul>'
				]
			].forEach(([source, key, result]) => {
				it(`Should select the line with ${key} in ${source}`, async function () {
					const [editor, browserMoves] = make(source);

					expect(press(editor, key)).is.true;
					browserMoves();
					await delay(20);

					expect(state(editor)).equals(result);
				});
			});

			it('Should leave a caret that the browser keeps in its block', async function () {
				const [editor] = make('<p>On|e<br>Two</p><hr><p>Below</p>');

				press(editor, 'ArrowDown');
				editor.s.setCursorIn(editor.editor.firstChild.lastChild, true);
				await delay(20);

				expect(state(editor)).equals(
					'<p>One<br>|Two</p><hr><p>Below</p>'
				);
			});

			it('Should leave the caret after a line in a list item (#1606)', async function () {
				const [editor] = make('<ul><li>One<hr></li></ul><p>|Two</p>');

				press(editor, 'ArrowUp');
				editor.s.setCursorAfter(editor.editor.querySelector('hr'));
				await delay(20);

				expect(state(editor)).equals(
					'<ul><li>One<hr>|</li></ul><p>Two</p>'
				);
			});
		});

		describe('Keys with the caret beside a line in the editor itself', function () {
			[
				[
					'<p>Above</p><hr>^<hr><p>Below</p>',
					'ArrowUp',
					'<p>Above</p>[hr]<hr><p>Below</p>'
				],
				[
					'<p>Above</p><hr>^<hr><p>Below</p>',
					'ArrowDown',
					'<p>Above</p><hr>[hr]<p>Below</p>'
				],
				[
					'<p>Above</p><hr>^<p>Below</p>',
					'ArrowDown',
					'<p>Above</p><hr><p>|Below</p>'
				],
				[
					'<p>Above</p><hr>^',
					'ArrowRight',
					'<p>Above</p><hr><p>|<br></p>'
				],
				[
					'<p>Above</p><hr>^<p>Below</p>',
					'Backspace',
					'<p>Above</p>[hr]<p>Below</p>'
				]
			].forEach(([source, key, result]) => {
				it(`Should turn ${source} into ${result} with ${key}`, function () {
					const [editor] = make(source);

					expect(press(editor, key)).is.false;
					expect(state(editor)).equals(result);
				});
			});

			it('Should leave the keys to the browser with enter: br', function () {
				const [editor] = make('Above<hr>^Below', { enter: 'br' });

				expect(press(editor, 'ArrowUp')).is.true;
			});
		});

		describe('Delete and Backspace in an empty line next to a line', function () {
			[
				[
					'<p>Above</p><hr><p>|<br></p><p>Below</p>',
					'Backspace',
					'<p>Above</p>[hr]<p>Below</p>'
				],
				[
					'<p>Above</p><p>|<br></p><hr><p>Below</p>',
					'Delete',
					'<p>Above</p>[hr]<p>Below</p>'
				],
				['<hr><p>|<br></p>', 'Backspace', '[hr]']
			].forEach(([source, key, result]) => {
				it(`Should remove the empty line and select the line: ${key} in ${source}`, function () {
					const [editor] = make(source);

					expect(press(editor, key)).is.false;
					expect(state(editor)).equals(result);
				});
			});

			it('Should leave Backspace at the start of a line of text to remove the line at once', function () {
				const [editor] = make('<p>Above</p><hr><p>|Below</p>');

				press(editor, 'Backspace');
				expect(state(editor)).equals('<p>Above</p><p>|Below</p>');
			});
		});

		describe('A click', function () {
			// `dy` is from the middle of the line
			const click = (line, dy, target = line) => {
				const box = line.getBoundingClientRect();
				const at = () => ({
					button: 0,
					clientX: box.left + 20,
					clientY: (box.top + box.bottom) / 2 + dy
				});

				simulateEvent(['mousedown', 'mouseup', 'click'], target, at);
			};

			it('Should select a line and open its popup, whose Delete removes the line', async function () {
				const [editor] = make('<p>Above</p><hr><p>Below</p>');

				click(editor.editor.querySelector('hr'), 0);
				expect(state(editor)).equals('<p>Above</p>[hr]<p>Below</p>');

				await delay(20);
				const popup = getOpenedPopup(editor);
				expect(popup).is.not.null;

				simulateEvent('click', getButton('delete', popup));
				expect(editor.value).equals('<p>Above</p><p>Below</p>');
			});

			it('Should select a line from a click just above it', function () {
				const [editor] = make('<p>Above</p><hr><p>Below</p>');
				const line = editor.editor.querySelector('hr');

				click(line, -line.offsetHeight / 2 - 4, editor.editor);
				expect(state(editor)).equals('<p>Above</p>[hr]<p>Below</p>');
			});

			it('Should select a line in a list item', function () {
				const [editor] = make('<ul><li>One<hr>Two</li></ul>');

				click(editor.editor.querySelector('hr'), 0);
				expect(state(editor)).equals('<ul><li>One[hr]Two</li></ul>');
			});

			[
				[
					'<p>Above</p>^<hr><p>Below</p>',
					'<p>Above|</p><hr><p>Below</p>'
				],
				[
					'<p>Above</p><hr>^<p>Below</p>',
					'<p>Above</p><hr><p>|Below</p>'
				],
				['^<hr><p>Below</p>', '<p>|<br></p><hr><p>Below</p>'],
				['<p>Above</p><hr>^', '<p>Above</p><hr><p>|<br></p>']
			].forEach(([source, result]) => {
				it(`Should move the caret to the nearest line of text after a click further off: ${source}`, async function () {
					const [editor] = make(source);

					simulateEvent('mouseup', editor.editor);
					await delay(20);

					expect(state(editor)).equals(result);
				});
			});
		});

		it('Should frame the selected line while it is selected', async function () {
			const [editor] = make('<p>Above</p>[hr]<p>Below</p>');
			const line = editor.editor.querySelector('hr');

			await delay(20);
			expect(getComputedStyle(line).outlineStyle).equals('solid');

			editor.s.setCursorIn(editor.editor.firstChild);
			await delay(20);
			expect(getComputedStyle(line).outlineStyle).equals('none');
		});
	});

	describe('With no stray character beside the inserted block (#1796)', () => {
		const insertAt = (html, insert) => {
			const editor = getJodit();

			editor.value = html;
			setCursorToChar(editor);
			insert(editor);

			return editor.editor.innerHTML.replace(/\uFEFF/g, '[inv]');
		};

		const hr = editor => editor.execCommand('insertHorizontalRule');

		const table = editor =>
			editor.s.insertNode(
				editor.createInside.fromHTML(
					'<table><tbody><tr><td>cell</td></tr></tbody></table>'
				)
			);

		it('Should leave none at the end of a line', () => {
			expect(insertAt('<p>first|</p>', hr)).equals(
				'<p>first</p><hr><p><br></p>'
			);
		});

		it('Should leave none before a following line', () => {
			expect(insertAt('<p>first|</p><p>second</p>', hr)).equals(
				'<p>first</p><hr><p>second</p>'
			);
		});

		it('Should leave none at the start of a line', () => {
			expect(insertAt('<p>|first</p>', hr)).equals('<hr><p>first</p>');
		});

		it('Should leave none in the middle of a line', () => {
			expect(insertAt('<p>fi|rst</p>', hr)).equals(
				'<p>fi</p><hr><p>rst</p>'
			);
		});

		it('Should leave none before a table', () => {
			expect(insertAt('<p>first|</p>', table)).equals(
				'<p>first</p><table><tbody><tr><td>cell</td></tr></tbody></table>'
			);
		});

		it('Should keep a space before an inline element', () => {
			const space = insertAt('<p><strong>a</strong> |</p>', editor =>
				editor.s.insertNode(editor.createInside.element('em', 'b'))
			);

			expect(space).contains('</strong> <em>b</em>');
		});
	});

	describe('The line added after the rule (#1807)', () => {
		// The tests run with `cleanHTML.fillEmptyParagraph` off, so only the
		// command can give the line its `<br>`
		it('Should keep its height once the caret leaves', () => {
			const editor = getJodit();
			editor.value = '<p>Above</p><p>Text|</p>';
			setCursorToChar(editor);
			editor.execCommand('insertHorizontalRule');

			const line = editor.editor.lastChild;
			editor.s.setCursorIn(editor.editor.firstChild);
			editor.s.insertHTML('x');

			expect(editor.value).equals(
				'<p>Abovex</p><p>Text</p><hr><p><br></p>'
			);
			expect(line.offsetHeight).above(0);
		});

		it('Should add only its own <br> with enter: br', () => {
			const editor = getJodit({ enter: 'br' });
			editor.value = 'Text|';
			setCursorToChar(editor);
			editor.execCommand('insertHorizontalRule');
			replaceCursorToChar(editor);

			expect(editor.value).equals('Text<hr>|<br>');
		});
	});
});
