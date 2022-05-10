/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('WrapNodes plugin test', function () {
	describe('Simple text', function () {
		it('Should wrap inside default block element', function () {
			const editor = getJodit();
			editor.value = 'test';
			expect(editor.value).equals('<p>test</p>');
		});

		it('Should wrap alone LI element', function () {
			const editor = getJodit();
			editor.value = '<li>test</li>';
			expect(editor.value).equals('<ul><li>test</li></ul>');
		});

		describe('For STYLE/SCRIPT elements', function () {
			it('Should not wrap it', function () {
				const editor = getJodit();
				editor.value =
					'test' +
					'<style>.a{color: red;}</style>' +
					'<script>console.log(111);</script>' +
					'sdsdsd';

				editor.selection.setCursorAfter(editor.editor.firstChild);
				editor.setEditorValue();

				expect(editor.value).equals(
					'<p>test</p><style>.a{color: red;}</style><script>console.log(111);</script><p>sdsdsd</p>'
				);
			});
		});

		describe('Block elements', function () {
			it('Should not wrap it', function () {
				const editor = getJodit();
				editor.value =
					'<section>test</section>stop<p>post</p><article>yes</article>';
				editor.selection.setCursorAfter(editor.editor.firstChild);

				editor.selection.save();
				editor.setEditorValue();

				expect(editor.value).equals(
					'<section>test</section><p>stop</p><p>post</p><article>yes</article>'
				);
			});
		});

		describe('Change selection marker', function () {
			it('Should not wrap it', function () {
				const editor = getJodit();
				editor.value = 'test';
				editor.selection.setCursorAfter(editor.editor.firstChild);

				editor.selection.save();
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

	describe('BR', function () {
		it('Should not wrap them', function () {
			const editor = getJodit();
			editor.value = 'test <br>test <br>test <br>test <br>';
			expect(editor.value).equals(
				'<p>test </p><br><p>test </p><br><p>test </p><br><p>test </p><br>'
			);
		});

		describe('Several BR without texts', function () {
			it('Should not wrap inside one block', function () {
				const editor = getJodit({
					enter: 'div'
				});
				editor.value = '<br><br><br>';
				expect(editor.value).equals('<br><br><br>');
			});
		});
	});

	describe('History', function () {
		it('Should not change history stack length', function () {
			const editor = getJodit();
			editor.value = 'test';
			expect(editor.value).equals('<p>test</p>');
			expect(editor.history.length).equals(1);
			editor.history.undo();
			expect(editor.value).equals('');
		});
	});

	describe('Exclude tags', function () {
		describe(
			'Default tags ' + Jodit.defaultOptions.wrapNodes.exclude,
			function () {
				it('Should not wrap this tags', function () {
					const editor = getJodit();
					editor.value =
						'test <br> <style>*  {color: red} </style> <hr> <img>';
					expect(editor.value).equals(
						'<p>test </p><br> <style>*  {color: red} </style> <hr> <p><img></p>'
					);
				});
			}
		);

		it('Should not wrap this tags', function () {
			const editor = getJodit({
				wrapNodes: {
					exclude: ['img']
				}
			});
			editor.value = 'test <img>';
			expect(editor.value).equals('<p>test </p><img>');
		});
	});

	describe('Disable plugin', function () {
		it('Should not change anything', function () {
			const editor = getJodit({
				disablePlugins: ['WrapNodes']
			});

			editor.value = 'test';
			expect(editor.value).equals('test');
		});
	});
});
