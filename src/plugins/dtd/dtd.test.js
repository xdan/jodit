/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test dtd plugin', () => {
	describe('Before insertNode', () => {
		describe('Enable dtd.checkBlockNesting', () => {
			describe('Not empty parent block', () => {
				it('should move new block after parent', () => {
					const editor = getJodit();
					editor.value = '<p>test|</p>';
					setCursorToChar(editor);
					editor.s.insertHTML(
						'<table><tbody><tr><td>1</td></tr></tbody></table>'
					);
					expect(sortAttributes(editor.value)).eq(
						'<p>test</p><table><tbody><tr><td>1</td></tr></tbody></table>'
					);
				});
			});

			describe('Empty parent block', () => {
				it('should replace parent block', () => {
					const editor = getJodit();
					editor.value = '<p>|<br></p>';
					setCursorToChar(editor);
					editor.s.insertHTML(
						'<table><tbody><tr><td>1</td></tr></tbody></table>'
					);
					expect(sortAttributes(editor.value)).eq(
						'<table><tbody><tr><td>1</td></tr></tbody></table>'
					);
				});
			});

			describe('Empty line in DIV mode (#1315)', () => {
				it('should replace the line, as an empty paragraph is replaced', () => {
					const editor = getJodit({ enter: 'DIV' });
					editor.value = '<div>|<br></div>';
					setCursorToChar(editor);
					editor.s.insertHTML(
						'<div>tamdm:10,000</div><div>tamdm:100,000</div>'
					);
					expect(editor.editor.innerHTML).eq(
						'<div>tamdm:10,000</div><div>tamdm:100,000</div>'
					);

					const { range } = editor.s;
					expect(range.startContainer.nodeValue).eq('tamdm:100,000');
					expect(range.startOffset).eq(13);
				});

				it('should keep a container that holds the empty line', () => {
					const editor = getJodit({ enter: 'DIV' });
					editor.value = '<div class="box"><div>|<br></div></div>';
					setCursorToChar(editor);
					editor.s.insertHTML('<div>one</div><div>two</div>');
					expect(sortAttributes(editor.value)).eq(
						'<div class="box"><div>one</div><div>two</div></div>'
					);
				});
			});
		});

		describe('Disable dtd.checkBlockNesting', () => {
			it('should not check nesting', () => {
				const editor = getJodit({
					dtd: {
						checkBlockNesting: false
					}
				});
				editor.value = '<p>test|</p>';
				setCursorToChar(editor);
				editor.s.insertHTML(
					'<table><tbody><tr><td>1</td></tr></tbody></table>'
				);
				expect(sortAttributes(editor.value)).eq(
					'<p>test<table><tbody><tr><td>1</td></tr></tbody></table></p>'
				);
			});
		});

		describe('Add to dtd.blockLimits', () => {
			it('should not check nesting', () => {
				const editor = getJodit({
					dtd: {
						blockLimits: {
							p: 1
						}
					}
				});
				editor.value = '<p>test|</p>';
				setCursorToChar(editor);
				editor.s.insertHTML(
					'<table><tbody><tr><td>1</td></tr></tbody></table>'
				);
				expect(sortAttributes(editor.value)).eq(
					'<p>test<table><tbody><tr><td>1</td></tr></tbody></table></p>'
				);
			});
		});
	});

	describe('Insert blocks into a list item (#1573)', () => {
		[
			[
				'<ul><li>|<br></li></ul>',
				'<p>one</p><p>two</p>',
				'<ul><li><p>one</p><p>two</p></li></ul>'
			],
			[
				'<ul><li>item|</li></ul>',
				'<p>one</p>',
				'<ul><li>item<p>one</p></li></ul>'
			],
			[
				'<ol><li>|<br></li></ol>',
				'<h2>one</h2>',
				'<ol><li><h2>one</h2></li></ol>'
			],
			[
				'<dl><dt>term</dt><dd>|<br></dd></dl>',
				'<p>one</p><p>two</p>',
				'<dl><dt>term</dt><dd><p>one</p><p>two</p></dd></dl>'
			],
			[
				'<ul><li>|<br></li></ul>',
				'<p>intro</p><ul><li>x</li></ul>',
				'<ul><li><p>intro</p><ul><li>x</li></ul></li></ul>'
			]
		].forEach(([value, insert, result]) => {
			it(`should keep ${insert} inside the item of ${value}`, () => {
				const editor = getJodit();
				editor.value = value;
				setCursorToChar(editor);
				editor.s.insertHTML(insert);
				expect(sortAttributes(editor.value)).eq(result);
			});
		});

		describe('A list', () => {
			[
				[
					'<ul><li>|<br></li></ul>',
					'<ul><li>x</li><li>y</li></ul>',
					'<ul><li>x</li><li>y</li></ul>'
				],
				[
					'<ul><li>a</li><li>|<br></li><li>b</li></ul>',
					'<ol><li>x</li><li>y</li></ol>',
					'<ul><li>a</li><li>x</li><li>y</li><li>b</li></ul>'
				],
				[
					'<ul><li>item|</li></ul>',
					'<ul><li>x</li></ul>',
					'<ul><li>item</li><li>x</li></ul>'
				],
				[
					'<ul><li><p>|<br></p></li></ul>',
					'<ul><li>x</li></ul>',
					'<ul><li>x</li></ul>'
				],
				[
					'<ul><li>a<ul><li>|<br></li></ul></li></ul>',
					'<ul><li>x</li></ul>',
					'<ul><li>a<ul><li>x</li></ul></li></ul>'
				]
			].forEach(([value, insert, result]) => {
				it(`should add the items of ${insert} to the list of ${value}`, () => {
					const editor = getJodit();
					editor.value = value;
					setCursorToChar(editor);
					editor.s.insertHTML(insert);
					expect(sortAttributes(editor.value)).eq(result);
				});
			});

			it('should leave the caret at the end of the last item', () => {
				const editor = getJodit();
				editor.value = '<ul><li>|<br></li></ul>';
				setCursorToChar(editor);
				editor.s.insertHTML('<ul><li>x</li><li>y</li></ul>');

				const { range } = editor.s;
				expect(range.startContainer.nodeValue).eq('y');
				expect(range.startOffset).eq(1);
			});

			it('should stay a list inside a table cell in the item', () => {
				const editor = getJodit();
				editor.value =
					'<ul><li><table><tbody><tr><td>|<br></td></tr></tbody></table></li></ul>';
				setCursorToChar(editor);
				editor.s.insertHTML('<ul><li>x</li></ul>');
				expect(sortAttributes(editor.value)).eq(
					'<ul><li><table><tbody><tr><td><ul><li>x</li></ul></td></tr></tbody></table></li></ul>'
				);
			});
		});
	});

	describe('Insert table into table cell', () => {
		describe('Cursor inside empty paragraph in a TD cell', () => {
			it('should insert table directly into TD without extra paragraph', () => {
				const editor = getJodit();
				editor.value =
					'<table><tbody><tr><td><p>|<br></p></td></tr></tbody></table>';
				setCursorToChar(editor);
				editor.s.insertHTML(
					'<table><tbody><tr><td>nested</td></tr></tbody></table>'
				);
				expect(sortAttributes(editor.value)).eq(
					'<table><tbody><tr><td><table><tbody><tr><td>nested</td></tr></tbody></table></td></tr></tbody></table>'
				);
			});
		});

		describe('Cursor inside non-empty paragraph in a TD cell', () => {
			it('should insert table after paragraph in TD', () => {
				const editor = getJodit();
				editor.value =
					'<table><tbody><tr><td><p>text|</p></td></tr></tbody></table>';
				setCursorToChar(editor);
				editor.s.insertHTML(
					'<table><tbody><tr><td>nested</td></tr></tbody></table>'
				);
				expect(sortAttributes(editor.value)).eq(
					'<table><tbody><tr><td><p>text</p><table><tbody><tr><td>nested</td></tr></tbody></table></td></tr></tbody></table>'
				);
			});
		});

		describe('Cursor directly in TD cell (no paragraph wrapper)', () => {
			it('should insert table into TD without issues', () => {
				const editor = getJodit();
				editor.value =
					'<table><tbody><tr><td>|<br></td></tr></tbody></table>';
				setCursorToChar(editor);
				editor.s.insertHTML(
					'<table><tbody><tr><td>nested</td></tr></tbody></table>'
				);
				expect(sortAttributes(editor.value)).eq(
					'<table><tbody><tr><td><table><tbody><tr><td>nested</td></tr></tbody></table><br></td></tr></tbody></table>'
				);
			});
		});
	});

	describe('After insertNode', () => {
		describe('Enable dtd.removeExtraBr', () => {
			[
				[
					'<p>test|<br></p>',
					'<img src="tests/artio.jpg">',
					'<p>test<img src="tests/artio.jpg">|</p>',
					'<p>test<img src="tests/artio.jpg">|<br></p>'
				],
				[
					'<p>|<br></p>',
					'<img src="tests/artio.jpg">',
					'<p><img src="tests/artio.jpg">|</p>',
					'<p><img src="tests/artio.jpg">|<br></p>'
				]
			].forEach(([value, insert, result1, result2]) => {
				describe(`for value ${value} and inserting ${insert}`, () => {
					describe('Enable removeExtraBr', () => {
						it('should move new block after parent', () => {
							const editor = getJodit({
								dtd: {
									removeExtraBr: true
								}
							});
							editor.value = value;
							setCursorToChar(editor);
							editor.s.insertHTML(insert);
							replaceCursorToChar(editor);
							expect(sortAttributes(editor.value)).eq(result1);
						});
					});

					describe('Disable removeExtraBr', () => {
						it('should move new block after parent', () => {
							const editor = getJodit({
								dtd: {
									removeExtraBr: false
								}
							});
							editor.value = value;
							setCursorToChar(editor);
							editor.s.insertHTML(insert);
							replaceCursorToChar(editor);
							expect(sortAttributes(editor.value)).eq(result2);
						});
					});
				});
			});
		});

		describe('Blocks inserted into an empty container (#1315)', () => {
			it('should leave the caret at the end of the inserted blocks', () => {
				const editor = getJodit();
				editor.value = '<div class="box">|<br></div>';
				setCursorToChar(editor);
				editor.s.insertHTML('<p>one</p><p>two</p>');
				expect(editor.editor.innerHTML).eq(
					'<div class="box"><p>one</p><p>two</p></div>'
				);

				const { range } = editor.s;
				expect(range.startContainer.nodeValue).eq('two');
				expect(range.startOffset).eq(3);
			});
		});

		describe('Cursor on an empty line (#1302)', () => {
			['bold', 'underline'].forEach(cmd => {
				it(`Should keep <br> line breaks when applying ${cmd}`, () => {
					const editor = getJodit();

					editor.value =
						'<div><br>test jodit line break<br>line break</div>';

					// Cursor on the leading empty line (before the first <br>)
					const div = editor.editor.querySelector('div');
					const range = editor.s.createRange();
					range.setStart(div, 0);
					range.collapse(true);
					editor.s.selectRange(range);

					editor.execCommand(cmd);

					// Both line breaks and the text must survive (the leading
					// <br> used to be removed).
					expect(editor.editor.querySelectorAll('br').length).equals(
						2
					);
					expect(editor.value).to.have.string(
						'<br>test jodit line break<br>line break'
					);
				});
			});
		});
	});
});
