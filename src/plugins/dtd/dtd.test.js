/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
	});
});
