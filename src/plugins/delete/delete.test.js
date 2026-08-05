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
