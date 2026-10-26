/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('WrapNodes plugin test', function () {
	describe('Simple text', function () {
		it('Should wrap inside default block element', function () {
			const editor = getJodit();
			editor.value = 'test';
			expect(editor.value).equals('<p>test</p>');
		});

		describe('Leading spaces', function () {
			it('Should wrap inside default block element', function () {
				const editor = getJodit();
				editor.value = Jodit.constants.INVISIBLE_SPACE + 'test';
				expect(editor.value).equals('<p>test</p>');
			});
		});

		describe('Use Japanese keyboard', function () {
			it('Should right wrap text', async function () {
				const editor = getJodit({
					language: 'ja'
				});
				editor.value = '<p>|</p>';
				setCursorToChar(editor);

				editor.s.insertNode(editor.createInside.text('た'));
				await editor.async.requestIdlePromise();
				editor.s.insertNode(editor.createInside.text('て'));
				await editor.async.requestIdlePromise();
				editor.s.insertNode(editor.createInside.text('い'));
				await editor.async.requestIdlePromise();

				expect(editor.value).equals('<p>たてい</p>');
			});
		});

		describe('Wrap leafs', function () {
			it('Should wrap alone LI element', function () {
				const editor = getJodit();
				editor.value = '<li>test</li>';
				expect(editor.value).equals('<ul><li>test</li></ul>');
			});

			it('Should wrap several LI elements', function () {
				const editor = getJodit();
				editor.value =
					'<li>test</li><li>test</li><p>test</p>test<li>test</li> <li>test</li>s<li>test</li>';
				expect(editor.value).equals(
					'<ul><li>test</li><li>test</li></ul><p>test</p><p>test</p><ul><li>test</li><li>test</li></ul> <p>s</p><ul><li>test</li></ul>'
				);
			});
		});

		describe('For STYLE/SCRIPT elements', function () {
			it('Should not wrap it', function () {
				const editor = getJodit();
				editor.value =
					'test' +
					'<style>.a{color: red;}</style>' +
					'<script>window._runActive(111);</script>' +
					'sdsdsd';

				editor.selection.setCursorAfter(editor.editor.firstChild);
				editor.setEditorValue();

				expect(editor.value).equals(
					'<p>test</p><style>.a{color: red;}</style><script>window._runActive(111);</script><p>sdsdsd</p>'
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

	describe('Inline elements that hold blocks (#1716)', function () {
		[
			'<p>Before</p><span style="font-family: Tahoma;"><p>Welcome</p></span><p>After</p>',
			'<strong><p>Bold</p></strong>',
			'<a href="/page"><div>Linked</div></a>',
			'<font face="Verdana"><table><tbody><tr><td>Cell</td></tr></tbody></table></font>',
			'<span style="font-size: 18pt;"><hr></span>'
		].forEach(value => {
			it(`Should leave ${value} as it is`, function () {
				const editor = getJodit();
				editor.value = value;
				expect(editor.value).equals(value);
			});
		});

		it('Should end a run of text before one', function () {
			const editor = getJodit();
			editor.value = 'Before<span><p>Inside</p></span>After';
			expect(editor.value).equals(
				'<p>Before</p><span><p>Inside</p></span><p>After</p>'
			);
		});

		it('Should still wrap one that holds embedded content', function () {
			const editor = getJodit();
			editor.value = 'Watch <span><iframe></iframe></span>';
			expect(editor.value).equals(
				'<p>Watch <span><iframe></iframe></span></p>'
			);
		});
	});

	describe('BR', function () {
		it('Should keep them with the lines they break', function () {
			const editor = getJodit();
			editor.value = 'test <br>test <br>test <br>test <br>';
			expect(editor.value).equals(
				'<p>test <br>test <br>test <br>test <br></p>'
			);
		});

		describe('Loose lines between blocks (#1718)', function () {
			[
				[
					'<p>Before</p>Line one<br>Line two<p>After</p>',
					'<p>Before</p><p>Line one<br>Line two</p><p>After</p>'
				],
				[
					'<p>Before</p>Line one<br><br>Line three<p>After</p>',
					'<p>Before</p><p>Line one<br><br>Line three</p><p>After</p>'
				],
				[
					'<p>Before</p>Line one<br><p>After</p>',
					'<p>Before</p><p>Line one<br></p><p>After</p>'
				],
				[
					'<p>Before</p><br>Line two<p>After</p>',
					'<p>Before</p><br><p>Line two</p><p>After</p>'
				]
			].forEach(([value, expected]) => {
				it(`Should give ${expected} for ${value}`, function () {
					const editor = getJodit();
					editor.value = value;
					expect(editor.value).equals(expected);
				});
			});
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

	describe('History', () => {
		it('Should not change history stack length', async () => {
			unmockPromise();
			const editor = getJodit({
				wrapNodes: {
					emptyBlockAfterInit: true
				}
			});
			await editor.async.requestIdlePromise();
			expect(editor.value).equals('<p><br></p>');
			editor.value = 'test';
			expect(editor.value).equals('<p>test</p>');
			expect(editor.history.length).equals(1);
			editor.history.undo();
			expect(editor.value).equals('<p><br></p>');
		});
	});

	describe('Exclude tags', function () {
		describe(
			'Default tags ' + Jodit.defaultOptions.wrapNodes.exclude,
			function () {
				it('Should not wrap these tags', function () {
					const editor = getJodit();
					editor.value =
						'test <br> <style>*  {color: red} </style> <hr> <img>';
					expect(editor.value).equals(
						'<p>test <br> </p><style>*  {color: red} </style> <hr> <p><img></p>'
					);
				});
			}
		);

		it('Should not wrap these tags', function () {
			const editor = getJodit({
				wrapNodes: {
					exclude: new Set(['img'])
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
