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
			expect(editor.value).equals('<hr><hr><hr><p></p>');
		});

		describe('Caret after the line (#1606)', function () {
			[
				['<p>One|</p>', '<p>One</p><hr><p>|</p>'],
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
					'<ul><li><p>One</p><hr><p>|</p></li></ul>'
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
});
