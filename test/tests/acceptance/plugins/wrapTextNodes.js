/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('WrapTextNodes plugin test', function () {
	describe('Simple text', function () {
		it('Should wrap inside default block element', function () {
			const editor = getJodit();
			editor.value = 'test';
			expect(editor.value).equals('<p>test</p>');
		});

		describe('Change selection marker', function () {
			it('Should not wrap it', function () {
				const editor = getJodit();
				editor.value = 'test';
				editor.selection.setCursorAfter(editor.editor.firstChild);

				const selInfo = editor.selection.save();
				editor.setEditorValue();

				expect(editor.value).equals('<p>test</p>');
			});
		});

		describe('Change default block tag', function () {
			it('Should wrap inside default this element', function () {
				const editor = getJodit({
					enter: 'div'
				});
				editor.value = 'test';
				expect(editor.value).equals('<div>test</div>');
			});
		});
	});

	describe('Several parts texts and elements nodes', function () {
		it('Should wrap text and not change block elements', function () {
			const editor = getJodit();
			editor.value =
				'test <span>one</span> <p>cool</p><div>cool</div><img src="/" alt="">text';
			expect(editor.value).equals(
				'<p>test <span>one</span> </p><p>cool</p><div>cool</div><p><img src="/" alt="">text</p>'
			);
		});
	});

	describe('Undo/redo stack', function () {
		it('Should not change', function () {
			const editor = getJodit();
			editor.value = 'test';
			expect(editor.value).equals('<p>test</p>');
			expect(editor.observer.stack.length).equals(1);
			editor.observer.undo();
			expect(editor.value).equals('');
		});
	});

	describe('Disable plugin', function () {
		it('Should not change anything', function () {
			const editor = getJodit({
				disablePlugins: ['WrapTextNodes']
			});

			editor.value = 'test';
			expect(editor.value).equals('test');
		});
	});
});
