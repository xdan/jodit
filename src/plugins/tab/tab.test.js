/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Tab test', () => {
	describe('Inside LI', () => {
		[
			[
				'<ul><li>test</li><li>|test</li></ul>',
				'<ul><li>test<ul><li>|test</li></ul></li></ul>'
			],
			[
				'<ol><li>test<ul><li>test</li><li>|test</li></ul></li></ol>',
				'<ol><li>test<ul><li>test<ul><li>|test</li></ul></li></ul></li></ol>'
			],
			[
				'<ul><li>test</li><li>test|</li></ul>',
				'<ul><li>test<ul><li>test|</li></ul></li></ul>'
			],
			[
				'<ul><li>test</li><li>te|st</li></ul>',
				'<ul><li>test<ul><li>te|st</li></ul></li></ul>'
			],
			[
				'<ul><li>test</li><li>t|e|st</li></ul>',
				'<ul><li>test<ul><li>t|e|st</li></ul></li></ul>'
			],
			[
				'<ul><li>test</li><li>|test<ul><li>te|st</li></ul></li></ul>',
				'<ul><li>test<ul><li>|test<ul><li>te|st</li></ul></li></ul></li></ul>'
			],
			[
				'<ul><li>|test</li><li>test|</li></ul>',
				'<ul><li>|test</li><li>test|</li></ul>'
			],
			[
				'<ol><li>test</li><li>|test</li></ol>',
				'<ol><li>test<ol><li>|test</li></ol></li></ol>'
			],
			[
				'<ol class="test"><li>test</li><li>|test</li></ol>',
				'<ol class="test"><li>test<ol class="test"><li>|test</li></ol></li></ol>'
			],
			[
				'<ol><li>|test</li><li>test</li></ol>',
				'<ol><li>|test</li><li>test</li></ol>'
			],
			[
				'<ul><li>test<ul><li>test</li></ul></li><li>|pop</li></ul>',
				'<ul><li>test<ul><li>test</li><li>|pop</li></ul></li></ul>'
			],
			[
				'<ul><li>test<ul><li>t|e|st</li></ul></li></ul>',
				'<ul><li>test</li><li>t|e|st</li></ul>',
				true
			],
			[
				'<ul><li>test<ul><li>t|est</li><li>pop</li></ul></li></ul>',
				'<ul><li>test</li><li>t|est<ul><li>pop</li></ul></li></ul>',
				true
			],
			[
				'<ul><li>test<ul><li>test</li><li>|pop</li></ul></li></ul>',
				'<ul><li>test<ul><li>test</li></ul></li><li>|pop</li></ul>',
				true
			],
			[
				'<ul><li>test<ul><li>test</li><li>stop</li><li>|pop</li></ul></li></ul>',
				'<ul><li>test<ul><li>test</li><li>stop</li></ul></li><li>|pop</li></ul>',
				true
			],
			[
				'<ul><li>test<ul><li>test</li><li>|pop</li><li>stop</li></ul></li></ul>',
				'<ul><li>test<ul><li>test</li></ul></li><li>|pop<ul><li>stop</li></ul></li></ul>',
				true
			],
			[
				'<ul><li>test<ol><li>test</li><li>|pop</li><li>stop</li></ol></li></ul>',
				'<ul><li>test<ol><li>test</li></ol></li><li>|pop<ol><li>stop</li></ol></li></ul>',
				true
			]
		].forEach(([key, result, shift]) => {
			describe(
				'For input ' +
					key +
					' with keypress tab' +
					(shift ? '+shift' : ''),
				() => {
					it('Should be result ' + result, () => {
						const editor = getJodit();
						editor.value = key;
						setCursorToChar(editor);
						simulateEvent('keydown', 'Tab', editor.editor, () => ({
							shiftKey: Boolean(shift)
						}));
						replaceCursorToChar(editor);
						expect(sortAttributes(editor.value)).eq(result);
					});
				}
			);
		});

		describe('Exec indent command', () => {
			it('Should work same way as tab', () => {
				const editor = getJodit();
				editor.value = '<ul><li>test</li><li>|test</li></ul>';
				setCursorToChar(editor);
				editor.execCommand('indent');
				replaceCursorToChar(editor);
				expect(sortAttributes(editor.value)).eq(
					'<ul><li>test<ul><li>|test</li></ul></li></ul>'
				);
			});
		});

		describe('Exec outdent command', () => {
			it('Should work same way as tab + shift', () => {
				const editor = getJodit();
				editor.value = '<ul><li>test<ul><li>|test</li></ul></li></ul>';
				setCursorToChar(editor);
				editor.execCommand('outdent');
				replaceCursorToChar(editor);
				expect(sortAttributes(editor.value)).eq(
					'<ul><li>test</li><li>|test</li></ul>'
				);
			});
		});

		describe('Disable tabInsideLiInsertNewList', () => {
			it('Should not create new list', () => {
				const editor = getJodit({
					tab: {
						tabInsideLiInsertNewList: false
					}
				});
				editor.value = '<ul><li>test</li><li>|test</li></ul>';
				setCursorToChar(editor);
				simulateEvent('keydown', 'Tab', editor.editor);
				replaceCursorToChar(editor);
				expect(sortAttributes(editor.value)).eq(
					'<ul><li>test</li><li>|test</li></ul>'
				);
			});
		});
	});
});
