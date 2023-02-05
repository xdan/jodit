/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('LineHeight plugin test', () => {
	describe('Options', () => {
		const { css } = Jodit.modules.Helpers;

		describe('defaultLineHeight', () => {
			it('Should change default css line-height property', () => {
				const box = getBox();
				box.style.lineHeight = 2.1;
				const editor = getJodit({
					defaultLineHeight: 4
				});

				editor.value = '<p>test</p>';

				expect(css(editor.editor, 'line-height'), 4);
				expect(css(editor.editor.firstElementChild, 'line-height'), 4);
			});

			describe('Set null', () => {
				it('Should do not change default css line-height property', () => {
					const box = getBox();
					box.style.lineHeight = 2.1;
					const editor = getJodit({
						defaultLineHeight: null
					});

					editor.value = '<p>test</p>';

					expect(css(editor.editor, 'line-height'), 2.1);
					expect(
						css(editor.editor.firstElementChild, 'line-height'),
						2.1
					);
				});
			});
		});

		describe('Set own list of values', () => {
			it('Should change default list', () => {
				const jodit = getJodit({
					controls: {
						lineHeight: {
							list: Jodit.atom([1, 2, 3, 3.5])
						}
					}
				});
				clickTrigger('lineHeight', jodit);
				const list = getOpenedPopup(jodit);
				expect(list.innerText).eq('1\n2\n3\n3.5');
			});
		});
	});

	describe('Select option in list', () => {
		[
			['<p>test|</p>', 1.2, '<p style="line-height:1.2">test|</p>'],
			[
				'<p>|test</p><p>test|</p>',
				1.5,
				'<p style="line-height:1.5">|test</p><p style="line-height:1.5">test|</p>'
			],
			[
				'<h1>stop</h1><p>|test</p><p>test|</p>',
				1.5,
				'<h1>stop</h1><p style="line-height:1.5">|test</p><p style="line-height:1.5">test|</p>'
			],
			[
				'<h1>stop</h1>\n<p>|test</p>\n<p>test|</p>',
				1.5,
				'<h1>stop</h1>\n<p style="line-height:1.5">|test</p>\n<p style="line-height:1.5">test|</p>'
			],
			['<p>|te|st</p>', 1.5, '<p style="line-height:1.5">|te|st</p>'],
			[
				'<p>|test</p><p>test</p>',
				1.5,
				'<p style="line-height:1.5">|test</p><p>test</p>'
			],
			[
				'<p>|One&nbsp;<em><span style="font-family: Verdana, Geneva, sans-serif; font-size: 18px; color: rgb(204, 0, 0);">{Two.Three}</span> </em>four five six seven eight {Nine.Ten} One {Two.Three} Four Five Six Seven Eight <strong>{Nine.Ten}.|</strong></p>',
				1.5,
				'<p style="line-height:1.5">|One <em><span style="color:#CC0000;font-family:Verdana,Geneva,sans-serif;font-size:18px">{Two.Three}</span> </em>four five six seven eight {Nine.Ten} One {Two.Three} Four Five Six Seven Eight <strong>{Nine.Ten}.|</strong></p>'
			]
		].forEach(([value, lineHeight, result]) => {
			describe('For text: ' + value + ' apply: ' + lineHeight, () => {
				it(
					'Should apply this option to block and result:' + result,
					() => {
						const jodit = getJodit();
						jodit.value = value;
						setCursorToChar(jodit);

						clickTrigger('lineHeight', jodit);
						const list = getOpenedPopup(jodit);
						clickButton(
							lineHeight.toString().replace('.', '_'),
							list
						);
						replaceCursorToChar(jodit);
						expect(sortAttributes(jodit.value)).eq(result);
					}
				);
			});
		});
	});

	describe('Exec command applyLineHeight', () => {
		[
			['<p>test|</p>', 1.2, '<p style="line-height:1.2">test|</p>'],
			[
				'<p>|test</p><p>test|</p>',
				1.5,
				'<p style="line-height:1.5">|test</p><p style="line-height:1.5">test|</p>'
			]
		].forEach(([value, lineHeight, result]) => {
			describe('For text: ' + value + ' apply: ' + lineHeight, () => {
				it(
					'Should apply this command to block and result:' + result,
					() => {
						const jodit = getJodit();
						jodit.value = value;
						setCursorToChar(jodit);
						jodit.execCommand('applyLineHeight', null, lineHeight);
						replaceCursorToChar(jodit);
						expect(sortAttributes(jodit.value)).eq(result);
					}
				);
			});
		});
	});
});
