/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Delete plugin', () => {
	describe('Select all and exec delete command', () => {
		[
			['<p>|test|</p>', ''],
			['<p>te|st|</p>', '<p>te</p>'],
			[
				`<p>|You must include the syntax highlighting library yourself, on your site:</p>
<pre class="language-html" contenteditable="false">...</pre>
<p>After that, the library must be initialized</p>
<pre class="language-javascript" contenteditable="false">Prism.highlightAll()|</pre>`,
				''
			]
		].forEach(([input, result]) => {
			describe('For input ' + input, () => {
				it('Should remove all content. Result: ' + result, () => {
					const editor = getJodit({
						disablePlugins: ['wrap-nodes']
					});

					editor.value = input;

					setCursorToChar(editor);
					simulateEvent(
						['keydown', 'keyup'],
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(
						sortAttributes(editor.value, ['contenteditable'])
					).equals(sortAttributes(result, ['contenteditable']));
				});
			});
		});
	});

	describe('Selection from one table cell into another', () => {
		const table = rows =>
			'<table><tbody>' +
			rows
				.map(
					row =>
						'<tr>' +
						row.map(cell => '<td>' + cell + '</td>').join('') +
						'</tr>'
				)
				.join('') +
			'</tbody></table>';

		[
			[
				table([
					['a|1', 'b|1'],
					['a2', 'b2']
				]),
				table([
					['a|', '1'],
					['a2', 'b2']
				])
			],
			[
				table([
					['a|1', 'b1'],
					['a2', 'b|2']
				]),
				table([
					['a|', '<br>'],
					['<br>', '2']
				])
			],
			[table([['|a1', 'b1|']]), table([['|<br>', '<br>']])],
			[
				table([['<p>a|1</p>', '<p>b|1</p>']]),
				table([['<p>a|</p>', '<p>1</p>']])
			],
			[
				table([
					['a|1', 'b|1'],
					['a2', 'b2']
				]),
				table([
					['a|', '1'],
					['a2', 'b2']
				]),
				Jodit.KEY_DELETE
			]
		].forEach(([input, result, key = Jodit.KEY_BACKSPACE]) => {
			it(`Should clear the selected text and keep the cells: ${input} => ${result} on ${key}`, () => {
				const editor = getJodit({ history: { timeout: 0 } });
				editor.value = input;
				setCursorToChar(editor);

				simulateEvent('keydown', key, editor.editor);
				replaceCursorToChar(editor);

				expect(sortAttributes(editor.value)).equals(result);
			});
		});
	});

	describe('Selection from a table cell to outside the table', () => {
		const table = rows =>
			'<table><tbody>' +
			rows
				.map(
					row =>
						'<tr>' +
						row.map(cell => '<td>' + cell + '</td>').join('') +
						'</tr>'
				)
				.join('') +
			'</tbody></table>';

		[
			[
				table([
					['a1', 'b1'],
					['a2', 'b|2']
				]) + '<p>Af|ter</p>',
				table([
					['a1', 'b1'],
					['a2', 'b|']
				]) + '<p>ter</p>'
			],
			[
				table([
					['a|1', 'b1'],
					['a2', 'b2']
				]) + '<p>Af|ter</p>',
				table([
					['a|', '<br>'],
					['<br>', '<br>']
				]) + '<p>ter</p>'
			],
			[table([['a1', 'b|1']]) + '<p>After|</p>', table([['a1', 'b|']])],
			[
				'<p>Be|fore</p>' +
					table([
						['a1', 'b|1'],
						['a2', 'b2']
					]),
				'<p>Be|</p>' +
					table([
						['<br>', '1'],
						['a2', 'b2']
					])
			],
			[
				table([['a|1']]) + '<p>Mid</p>' + table([['b|1']]),
				table([['a|']]) + table([['1']])
			],
			[
				table([
					['a1', 'b1'],
					['a2', 'b|2']
				]) + '<p>Af|ter</p>',
				table([
					['a1', 'b1'],
					['a2', 'b|']
				]) + '<p>ter</p>',
				Jodit.KEY_DELETE
			]
		].forEach(([input, result, key = Jodit.KEY_BACKSPACE]) => {
			it(`Should keep the cells and the block outside: ${input} => ${result} on ${key}`, () => {
				const editor = getJodit({ history: { timeout: 0 } });
				editor.value = input;
				setCursorToChar(editor);

				simulateEvent('keydown', key, editor.editor);
				replaceCursorToChar(editor);

				expect(sortAttributes(editor.value)).equals(result);
			});
		});
	});

	describe('Remove selected image by keyboard', () => {
		// https://github.com/jodit/jodit-react/issues/226
		[Jodit.KEY_DELETE, Jodit.KEY_BACKSPACE].forEach(key => {
			it(`Should remove the image without throwing on ${key}`, () => {
				const editor = getJodit();
				editor.value =
					'<p>text <img src="tests/artio.jpg" alt=""> tail</p>';

				const img = editor.editor.querySelector('img');
				editor.s.select(img);

				simulateEvent('keydown', key, editor.editor);

				expect(editor.editor.querySelector('img')).is.null;
				expect(editor.value.includes('text')).is.true;
			});
		});
	});
});
