/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
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
	describe('Option tab.spaces (#1728)', () => {
		const NBSP4 = '&nbsp;&nbsp;&nbsp;&nbsp;';

		const press = (editor, key, shiftKey = false) => {
			let event;
			simulateEvent('keydown', key, editor.editor, e => {
				event = e;
				return { shiftKey };
			});
			return event;
		};

		describe('Tab at a caret', () => {
			it('Should be left to the browser by default', () => {
				const editor = getJodit();
				editor.value = '<p>te|st</p>';
				setCursorToChar(editor);

				const event = press(editor, 'Tab');

				replaceCursorToChar(editor);
				expect(editor.value).equals('<p>te|st</p>');
				expect(event.defaultPrevented).is.false;
			});

			[
				['<p>te|st</p>', `<p>te${NBSP4}|st</p>`],
				[
					'<p><strong>te|st</strong></p>',
					`<p><strong>te${NBSP4}|st</strong></p>`
				],
				['<pre>te|st</pre>', '<pre>te\t|st</pre>']
			].forEach(([value, expected]) => {
				it(`Should turn ${value} into ${expected}`, () => {
					const editor = getJodit({ tab: { spaces: 4 } });
					editor.value = value;
					setCursorToChar(editor);

					const event = press(editor, 'Tab');

					replaceCursorToChar(editor);
					expect(editor.value).equals(expected);
					expect(event.defaultPrevented).is.true;
				});
			});

			it('Should still nest a list item that has one before it', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = '<ul><li>one</li><li>te|st</li></ul>';
				setCursorToChar(editor);

				press(editor, 'Tab');

				replaceCursorToChar(editor);
				expect(editor.value).equals(
					'<ul><li>one<ul><li>te|st</li></ul></li></ul>'
				);
			});

			it('Should still move to the next cell in a table', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value =
					'<table><tbody><tr><td>te|st</td><td>next</td></tr></tbody></table>';
				setCursorToChar(editor);

				press(editor, 'Tab');

				replaceCursorToChar(editor);
				expect(editor.value).equals(
					'<table><tbody><tr><td>test</td><td>|next|</td></tr></tbody></table>'
				);
			});

			[
				[
					'<ul><li>te|st</li><li>two</li></ul>',
					'<ul style="margin-left:10px"><li>te|st</li><li>two</li></ul>'
				],
				[
					'<ul><li>one<ul><li>tw|o</li></ul></li></ul>',
					'<ul><li>one<ul style="margin-left:10px"><li>tw|o</li></ul></li></ul>'
				]
			].forEach(([value, expected]) => {
				it(`Should indent the list from its first item, as Word does: ${value} => ${expected}`, () => {
					const editor = getJodit({ tab: { spaces: 4 } });
					editor.value = value;
					setCursorToChar(editor);

					press(editor, 'Tab');

					replaceCursorToChar(editor);
					expect(sortAttributes(editor.value)).equals(expected);
				});
			});

			it('Should keep the focus with no caret in the editor', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = '<p>test</p>';
				editor.ed.getSelection().removeAllRanges();

				const event = press(editor, 'Tab');

				expect(event.defaultPrevented).is.true;
				expect(editor.value).equals('<p>test</p>');
			});

			it('Should stay in an empty paragraph after Tab and Backspace', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = '<p><br></p>';
				editor.s.setCursorIn(editor.editor.firstChild);

				press(editor, 'Tab');
				press(editor, 'Backspace');
				const event = press(editor, 'Tab');

				expect(event.defaultPrevented).is.true;
				expect(editor.value).contains(NBSP4);
			});

			it('Should do nothing in a read-only editor', () => {
				const editor = getJodit({ readonly: true, tab: { spaces: 4 } });
				editor.value = '<p>test</p>';
				editor.s.setCursorIn(editor.editor.firstChild);

				press(editor, 'Tab');

				expect(editor.value).equals('<p>test</p>');
			});

			it('Should be one step in the history', () => {
				const editor = getJodit({
					tab: { spaces: 4 },
					history: { timeout: 0 }
				});
				editor.value = '<p>te|st</p>';
				setCursorToChar(editor);

				press(editor, 'Tab');
				expect(editor.value).equals(`<p>te${NBSP4}st</p>`);

				editor.execCommand('undo');
				expect(editor.value).equals('<p>test</p>');
			});
		});

		describe('Shift+Tab at a caret', () => {
			[
				[`<p>Name:${NBSP4}|Smith</p>`, '<p>Name:|Smith</p>'],
				['<p>Name:&nbsp;&nbsp;|Smith</p>', '<p>Name:|Smith</p>'],
				['<p>Name:&nbsp; |Smith</p>', '<p>Name:|Smith</p>'],
				[`<p>${NBSP4}te|st</p>`, '<p>te|st</p>'],
				[
					`<p>${NBSP4}&nbsp;&nbsp;te|st</p>`,
					'<p>&nbsp;&nbsp;te|st</p>'
				],
				['<p>&nbsp;&nbsp;te|st</p>', '<p>te|st</p>'],
				[`<p>one<br>${NBSP4}tw|o</p>`, '<p>one<br>tw|o</p>'],
				['<pre>code\t|</pre>', '<pre>code|</pre>'],
				['<pre>one\n\ttw|o</pre>', '<pre>one\ntw|o</pre>'],
				['<p style="margin-left:10px">te|st</p>', '<p>te|st</p>'],
				[`<p>${NBSP4}|</p>`, '<p>|<br></p>'],
				[
					'<ul style="margin-left:10px"><li>te|st</li></ul>',
					'<ul><li>te|st</li></ul>'
				]
			].forEach(([value, expected]) => {
				it(`Should take out what Tab put in: ${value} => ${expected}`, () => {
					const editor = getJodit({ tab: { spaces: 4 } });
					editor.value = value;
					setCursorToChar(editor);

					const event = press(editor, 'Tab', true);

					replaceCursorToChar(editor);
					expect(editor.value).equals(expected);
					expect(event.defaultPrevented).is.true;
				});
			});

			[
				'<p>te|st</p>',
				'<p>Hello |world</p>',
				`<p>${NBSP4}one<br>tw|o</p>`,
				'<ul><li>te|st</li></ul>'
			].forEach(value => {
				it(`Should stay in the editor when there's nothing to take out: ${value}`, () => {
					const editor = getJodit({ tab: { spaces: 4 } });
					editor.value = value;
					setCursorToChar(editor);

					const event = press(editor, 'Tab', true);

					replaceCursorToChar(editor);
					expect(editor.value).equals(value);
					expect(event.defaultPrevented).is.true;
				});
			});

			it('Should be one step in the history', () => {
				const editor = getJodit({
					tab: { spaces: 4 },
					history: { timeout: 0 }
				});
				editor.value = `<p>${NBSP4}te|st</p>`;
				setCursorToChar(editor);

				press(editor, 'Tab', true);
				expect(editor.value).equals('<p>test</p>');

				editor.execCommand('undo');
				expect(editor.value).equals(`<p>${NBSP4}test</p>`);
			});
		});

		describe('Escape', () => {
			[false, true].forEach(shiftKey => {
				it(`Should let the next ${shiftKey ? 'Shift+Tab' : 'Tab'} move the focus on`, () => {
					const editor = getJodit({ tab: { spaces: 4 } });
					editor.value = `<p>${NBSP4}te|st</p>`;
					setCursorToChar(editor);

					press(editor, 'Escape');
					const event = press(editor, 'Tab', shiftKey);

					replaceCursorToChar(editor);
					expect(editor.value).equals(`<p>${NBSP4}te|st</p>`);
					expect(event.defaultPrevented).is.false;
				});
			});

			it('Should let Shift+Tab move the focus on after the Shift key goes down', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = '<p>te|st</p>';
				setCursorToChar(editor);

				press(editor, 'Escape');
				press(editor, 'Shift', true);
				const event = press(editor, 'Tab', true);

				expect(event.defaultPrevented).is.false;
			});

			it('Should let Tab leave a table cell, which otherwise takes it', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value =
					'<table><tbody><tr><td>te|st</td><td>next</td></tr></tbody></table>';
				setCursorToChar(editor);

				press(editor, 'Escape');
				const event = press(editor, 'Tab');

				replaceCursorToChar(editor);
				expect(event.defaultPrevented).is.false;
				expect(editor.value).equals(
					'<table><tbody><tr><td>te|st</td><td>next</td></tr></tbody></table>'
				);
			});

			it("Should not count an Escape that closes a popup, as that's what it's for", () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = '<p>te|st</p>';
				setCursorToChar(editor);

				const popup = new Jodit.modules.Popup(editor);
				popup.setContent('Popup').open(() => ({
					left: 0,
					top: 0,
					width: 10,
					height: 10
				}));

				press(editor, 'Escape');
				const event = press(editor, 'Tab');

				expect(event.defaultPrevented).is.true;
				expect(editor.value).contains(NBSP4);
			});

			it('Should not let a Tab after a click move the focus on', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = '<p>te|st</p>';
				setCursorToChar(editor);

				press(editor, 'Escape');
				simulateEvent('mousedown', editor.editor);
				const event = press(editor, 'Tab');

				expect(event.defaultPrevented).is.true;
			});

			it('Should change nothing with the option off', () => {
				const editor = getJodit();
				editor.value = '<ul><li>one</li><li>tw|o</li></ul>';
				setCursorToChar(editor);

				press(editor, 'Escape');
				press(editor, 'Tab');

				replaceCursorToChar(editor);
				expect(editor.value).equals(
					'<ul><li>one<ul><li>tw|o</li></ul></li></ul>'
				);
			});

			it('Should not let a Tab after another key move the focus on', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = '<p>te|st</p>';
				setCursorToChar(editor);

				press(editor, 'Escape');
				press(editor, 'ArrowLeft');
				const event = press(editor, 'Tab');

				expect(event.defaultPrevented).is.true;
				expect(editor.value).contains(NBSP4);
			});
		});

		describe('Tab with a selection', () => {
			it('Should indent the selected blocks, and Shift+Tab outdent them', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = '<p>t|es|t</p>';
				setCursorToChar(editor);

				press(editor, 'Tab');
				expect(sortAttributes(editor.value)).equals(
					'<p style="margin-left:10px">test</p>'
				);

				press(editor, 'Tab', true);
				expect(editor.value).equals('<p>test</p>');
			});
		});

		describe('Backspace', () => {
			[
				[`<p>te${NBSP4}|st</p>`, '<p>te|st</p>'],
				[`<p>te${NBSP4}&nbsp;|st</p>`, '<p>te&nbsp;|st</p>'],
				['<p>te&nbsp; &nbsp; |st</p>', '<p>te|st</p>'],
				['<p>te&nbsp;&nbsp;&nbsp;|st</p>', '<p>te&nbsp;&nbsp;|st</p>']
			].forEach(([value, expected]) => {
				it(`Should turn ${value} into ${expected}`, () => {
					const editor = getJodit({ tab: { spaces: 4 } });
					editor.value = value;
					setCursorToChar(editor);

					press(editor, 'Backspace');

					replaceCursorToChar(editor);
					expect(editor.value).equals(expected);
				});
			});

			it('Should remove one space by default', () => {
				const editor = getJodit();
				editor.value = `<p>te${NBSP4}|st</p>`;
				setCursorToChar(editor);

				press(editor, 'Backspace');

				replaceCursorToChar(editor);
				expect(editor.value).equals('<p>te&nbsp;&nbsp;&nbsp;|st</p>');
			});

			it('Should remove the spaces after a letter typed after them is removed', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = '<p>te|st</p>';
				setCursorToChar(editor);

				press(editor, 'Tab');
				editor.s.insertHTML('X');
				press(editor, 'Backspace');
				press(editor, 'Backspace');

				replaceCursorToChar(editor);
				expect(editor.value).equals('<p>te|st</p>');
			});

			it('Should leave a <br> in a line it empties, so the line keeps its height', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = `<p>${NBSP4}|</p>`;
				setCursorToChar(editor);

				press(editor, 'Backspace');

				replaceCursorToChar(editor);
				expect(editor.value).equals('<p>|<br></p>');
			});

			it('Should take out one Tab at a time after several', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = '<p>te|st</p>';
				setCursorToChar(editor);

				press(editor, 'Tab');
				press(editor, 'Tab');
				press(editor, 'Tab');
				press(editor, 'Backspace');
				press(editor, 'Backspace');

				replaceCursorToChar(editor);
				expect(editor.value).equals(`<p>te${NBSP4}|st</p>`);
			});

			it('Should undo a Tab in one press', () => {
				const editor = getJodit({ tab: { spaces: 4 } });
				editor.value = '<p>te|st</p>';
				setCursorToChar(editor);

				press(editor, 'Tab');
				press(editor, 'Backspace');

				replaceCursorToChar(editor);
				expect(editor.value).equals('<p>te|st</p>');
			});
		});

		describe('A tab in pasted text', () => {
			const paste = (editor, data) =>
				simulateEvent('paste', editor.editor, event => {
					event.clipboardData = {
						types: Object.keys(data),
						getData: type => data[type] ?? ''
					};
				});

			const pasteInto = (
				value,
				data,
				options = { tab: { spaces: 4 } }
			) => {
				const editor = getJodit({
					askBeforePasteHTML: false,
					askBeforePasteFromWord: false,
					...options
				});
				editor.value = value;
				setCursorToChar(editor);
				paste(editor, data);
				return editor.value;
			};

			it('Should be kept by default', () => {
				expect(
					pasteInto('<p>|</p>', { 'text/plain': 'Name:\tSmith' }, {})
				).equals('<p>Name:\tSmith</p>');
			});

			it('Should become the spaces in plain text', () => {
				expect(
					pasteInto('<p>|</p>', { 'text/plain': 'Name:\tSmith' })
				).equals(`<p>Name:${NBSP4}Smith</p>`);
			});

			it('Should become the spaces in HTML', () => {
				expect(
					pasteInto('<p>|</p>', {
						'text/html': '<span>Name:\tSmith</span>'
					})
				).equals(`<p><span>Name:${NBSP4}Smith</span></p>`);
			});

			[
				[
					"Safari's Apple-tab-span",
					'<span>Name:<span class="Apple-tab-span" style="white-space:pre">\t</span>Smith</span>'
				],
				[
					"Google Docs' spans",
					'<span style="white-space:pre;white-space:pre-wrap;">Name:\tSmith</span>'
				]
			].forEach(([name, html]) => {
				it(`Should stay a tab where it's already shown, as in ${name}`, () => {
					expect(
						pasteInto('<p>|</p>', { 'text/html': html })
					).contains('\t');
				});
			});

			it('Should stay a tab when pasted into a pre', () => {
				expect(
					pasteInto('<pre>a|</pre>', { 'text/plain': 'Name:\tSmith' })
				).equals('<pre>aName:\tSmith</pre>');
			});

			it('Should leave the text of a style or script, as Word puts tabs in its CSS', () => {
				const editor = getJodit({ tab: { spaces: 4 } });

				expect(
					editor.e.fire(
						'beforePasteInsert',
						'<style>p\t{color:red}</style><script>if (a)\t{}</script><p>a\tb</p>'
					)
				).equals(
					`<style>p\t{color:red}</style><script>if (a)\t{}</script><p>a${NBSP4}b</p>`
				);
			});

			it('Should leave the tabs that lay out the HTML', () => {
				expect(
					pasteInto('<p>|</p>', {
						'text/html':
							'<ul>\n\t<li>One</li>\n\t<li>Two</li>\n</ul>'
					})
				).does.not.contain('&nbsp;');
			});
		});
	});
});
