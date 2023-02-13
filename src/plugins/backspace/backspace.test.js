/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Backspace/Delete key', function () {
	let editor, range;

	beforeEach(function () {
		editor = getJodit();
		editor.value = '<p>test</p>';
		range = editor.s.createRange(true);
	});

	describe('More cases', function () {
		[
			'<p><em>p</em></p><p><em>a|</em></p> => <p><em>p</em></p><p><em>|</em></p>',
			'<p><em>ab</em><em>|cd</em></p> => <p><em>a|</em><em>cd</em></p>',
			'<table><tbody><tr><td>|ab</td></tr></tbody></table> => <table><tbody><tr><td>|ab</td></tr></tbody></table>',
			'<table><tbody><tr><td>ab</td><td>|ab</td></tr></tbody></table> => <table><tbody><tr><td>ab</td><td>|ab</td></tr></tbody></table>',
			'<p>ab|cd</p> => <p>a|cd</p>',
			'<p>ab<strong>cd</strong>|ef</p> => <p>ab<strong>c|</strong>ef</p>',
			'<p>ab<img src="tests/artio.jpg">|cd</p> => <p>ab|cd</p>',
			'<p>ab<span contenteditable="false">test</span>|cd</p> => <p>ab|cd</p>',
			'<p>ab<span contenteditable="false">test</span><strong>|cd</strong></p> => <p>ab|<strong>cd</strong></p>',
			'<p>ab</p><div contenteditable="false">test</div><p>|cd</p> => <p>ab|</p><p>cd</p>',
			'<p>ab</p>\n <p>|<br></p> => <p>ab|</p>\n ',
			'<p>ab</p><p>|cd</p> => <p>ab|cd</p>',
			'<p>ab</p>\n<blockquote>|cd</blockquote> => <p>ab|cd</p>\n',
			'<p>ab</p>\n<h1>|cd</h1> => <p>ab|cd</p>\n',
			'<h1>cd</h1><p>|ab</p> => <h1>cd|ab</h1>',
			'<p>ab</p>\n\n\n<p><strong>|cd</strong></p> => <p>ab<strong>|cd</strong></p>\n\n\n',
			'<p>ab</p><p><strong>|cd</strong><em>ef</em></p> => <p>ab<strong>|cd</strong><em>ef</em></p>',
			'<p><strong>ab</strong></p><p><strong>|cd</strong></p> => <p><strong>ab</strong><strong>|cd</strong></p>',
			'<p><strong>ab</strong></p><p><strong><em>|cd</em></strong></p> => <p><strong>ab</strong><strong><em>|cd</em></strong></p>',
			'<p><strong>ab</strong></p><p><strong>|cd</strong><em>e</em></p> => <p><strong>ab</strong><strong>|cd</strong><em>e</em></p>',
			'<p><a>ab</a></p><p><strong>|cd</strong><em>e</em></p> => <p><a>ab</a><strong>|cd</strong><em>e</em></p>',
			'<ol><li>|ab</li><li>cd</li></ol> => <p>|ab</p><ol><li>cd</li></ol>',
			'<ol><li>ab</li><li>cd|</li></ol> => <ol><li>ab</li></ol><p>cd|</p> => Delete',
			'<ol><li>ab</li></ol><p>|cd</p> => <ol><li>ab|cd</li></ol>',
			'<p>ab</p><ol><li>|cd</li></ol> => <p>ab</p><p>|cd</p>',
			'<ol><li>ab</li><li>|cd</li></ol> => <ol><li>ab|cd</li></ol>',
			'test<br>|plot => test|plot =>  => {"enter": "br"}',
			'test<br>|plot => testtext|plot =>  => {"enter": "br"}  => text',
			'test<br>p|lot => test<br>|lot =>  => {"enter": "br"}',
			'test<br>p| => test<br>|<br> =>  => {"enter": "br"}',
			'<ol><li>ab</li></ol><ul><li>|cd</li><li>e</li></ul> => <ol><li>ab</li></ol><p>|cd</p><ul><li>e</li></ul>'
		].forEach(function (pars) {
			const [key, value, button, options, insert] = pars.split(' => ');

			describe(`For key "${key}"`, function () {
				it(`Should be ${value}`, async () => {
					const editor = getJodit(
						(options && JSON.parse(options)) || {}
					);
					editor.value = key;
					setCursorToChar(editor);
					simulateEvent(
						'keydown',
						button || Jodit.KEY_BACKSPACE,
						editor.editor
					);

					if (insert) {
						await editor.async.requestIdlePromise();
						editor.s.insertNode(editor.createInside.text(insert));
					}

					replaceCursorToChar(editor);
					expect(sortAttributes(editor.value)).equals(value);
				});
			});
		});
	});

	describe('For non collapsed range', function () {
		describe('Select part of text inside P element', function () {
			it('Should remove only selected range', function () {
				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(editor.editor.firstChild.firstChild, 4);

				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect('<p>te</p>').equals(editor.value);
			});
		});

		describe('Select whole text inside element', function () {
			describe('Inside P', function () {
				it('Should remove selected range and remove this P', function () {
					range.selectNodeContents(editor.editor.firstChild);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect('<p><br></p>').equals(editor.value);
				});
			});

			describe('Inside table cell', function () {
				it('Should only remove selected range', function () {
					editor.value =
						'<table><tbody><tr><td>test</td><td>1</td></tr></tbody></table>';

					range.selectNodeContents(editor.editor.querySelector('td'));
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(
						'<table><tbody><tr><td></td><td>1</td></tr></tbody></table>'
					).equals(editor.value.replace('<br>', ''));
				});
			});
		});
	});

	describe('Unicode sequences', function () {
		describe('BackSpace', function () {
			it('Should remove previous unicode sequence before cursor', function () {
				editor.value = '<p>a阪😄👌|test</p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
				expect(editor.value).equals('<p>a阪😄test</p>');

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
				expect(editor.value).equals('<p>a阪test</p>');

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
				expect(editor.value).equals('<p>atest</p>');

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
				expect(editor.value).equals('<p>test</p>');
			});
		});

		describe('Delete', function () {
			it('Should remove previous unicode sequence before cursor', function () {
				editor.value = '<p>stop👌|😄阪test</p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);
				expect(editor.value).equals('<p>stop👌阪test</p>');

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);
				expect(editor.value).equals('<p>stop👌test</p>');

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);
				expect(editor.value).equals('<p>stop👌est</p>');
			});
		});
	});

	describe('Edit simple text', function () {
		describe('BackSpace', function () {
			it('Should remove previous char before cursor', function () {
				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.collapse(true);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(editor.value).equals('<p>tst</p>');
			});

			describe('With spaces', function () {
				it('Should remove previous char before cursor', function () {
					editor.value = '<p>a b c |d e</p>';
					setCursorToChar(editor);

					for (let i = 1; i <= 4; i += 1) {
						simulateEvent(
							['keydown', 'keyup', 'keypress'],
							Jodit.KEY_BACKSPACE,
							editor.editor
						);
					}

					expect(editor.value).equals('<p>a d e</p>');
				});
			});

			describe('Text after SPAN and cursor in the left edge of text', function () {
				it('Should remove char inside span', function () {
					editor.value = '<p><span>AAA</span>test</p>';

					range.setStart(editor.editor.firstChild.lastChild, 0);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(sortAttributes(editor.value)).equals(
						'<p><span>AA</span>test</p>'
					);
				});
			});

			describe('Cursor in the outside some element', function () {
				it('Should remove last char in the previous element', function () {
					editor.value = '<p><strong>123</strong></p>';

					range.setStartAfter(editor.editor.firstChild.firstChild);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(editor.value).equals('<p><strong>12</strong></p>');

					editor.s.insertHTML(' 1 ');
					expect(editor.value).equals(
						'<p><strong>12 1 </strong></p>'
					);
				});
			});

			describe('With pressed `ctrl/cmd`', function () {
				it('Should remove previous word before cursor', function () {
					editor.value = '<p>Hello evil| world</p>';
					setCursorToChar(editor);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor,
						function (opt) {
							opt.ctrlKey = true;
						}
					);

					expect(editor.value).equals('<p>Hello world</p>');
				});

				describe('Delete`', function () {
					it('Should remove next word text after cursor', function () {
						editor.value = '<p>Hello |evil world</p>';

						setCursorToChar(editor);

						simulateEvent(
							'keydown',
							Jodit.KEY_DELETE,
							editor.editor,
							function (opt) {
								opt.ctrlKey = true;
							}
						);

						expect(editor.value).equals('<p>Hello world</p>');
					});
				});
			});

			describe('With pressed `SHIFT`', function () {
				it('Should remove previous whole part of text before cursor', function () {
					editor.value = '<p>Hello evil| world</p>';
					setCursorToChar(editor);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor,
						function (opt) {
							opt.ctrlKey = true;
							opt.shiftKey = true;
						}
					);

					expect(editor.value).equals('<p> world</p>');
				});

				describe('Delete`', function () {
					it('Should remove next whole part of text after cursor', function () {
						editor.value = '<p>Hello |evil world</p>';

						setCursorToChar(editor);

						simulateEvent(
							'keydown',
							Jodit.KEY_DELETE,
							editor.editor,
							function (opt) {
								opt.ctrlKey = true;
								opt.shiftKey = true;
							}
						);

						expect(editor.value).equals('<p>Hello </p>');
					});
				});
			});
		});

		describe('Delete', function () {
			it('Should remove next char after cursor', function () {
				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.collapse(true);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

				expect(editor.value).equals('<p>tet</p>');
			});
		});

		describe('Near with invisible char', function () {
			describe('BackSpace', function () {
				it('Should remove previous char and invisible char before cursor', function () {
					editor.value = '<p>te' + Jodit.INVISIBLE_SPACE + 'st</p>';

					range.setStart(editor.editor.firstChild.firstChild, 3);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(editor.value).equals('<p>tst</p>');
				});
			});

			describe('Delete', function () {
				it('Should remove next char and invisible char after cursor', function () {
					editor.value = '<p>te' + Jodit.INVISIBLE_SPACE + 'st</p>';

					range.setStart(editor.editor.firstChild.firstChild, 2);
					editor.s.selectRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					expect(editor.value).equals('<p>tet</p>');
				});
			});

			describe('After BackSpace/Delete left empty node', function () {
				describe('BackSpace', function () {
					it('Should remove whole node', function () {
						editor.value = '<p>' + Jodit.INVISIBLE_SPACE + 's</p>';

						range.setStart(editor.editor.firstChild.firstChild, 2);
						editor.s.selectRange(range);

						simulateEvent(
							'keydown',
							Jodit.KEY_BACKSPACE,
							editor.editor
						);

						expect(editor.getNativeEditorValue()).equals(
							'<p><br></p>'
						);
					});
				});

				describe('Delete', function () {
					it('Should remove whole node', function () {
						editor.value = '<p>d' + Jodit.INVISIBLE_SPACE + '</p>';

						range.setStart(editor.editor.firstChild.firstChild, 0);
						editor.s.selectRange(range);

						simulateEvent(
							'keydown',
							Jodit.KEY_DELETE,
							editor.editor
						);

						expect(editor.getNativeEditorValue()).equals(
							'<p><br></p>'
						);
					});
				});
			});
		});

		describe('Cursor after empty text node', function () {
			describe('BackSpace', function () {
				it('Should remove this empty text node and first normal char in previous node', function () {
					const p = editor.editor.firstChild;

					p.appendChild(
						editor.createInside.text(
							Jodit.INVISIBLE_SPACE.repeat(4)
						)
					);

					p.appendChild(
						editor.createInside.text(
							Jodit.INVISIBLE_SPACE.repeat(4) + 'stop'
						)
					);

					expect(p.childNodes.length).equals(3);

					range.setStart(p.lastChild, 4);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(p.childNodes.length).equals(2);
					expect(editor.getNativeEditorValue()).equals(
						'<p>tesstop</p>'
					);
				});
			});

			describe('Delete', function () {
				it('Should remove this empty text node and first normal char in next node', function () {
					const p = editor.editor.firstChild;

					p.appendChild(
						editor.createInside.text(
							Jodit.INVISIBLE_SPACE.repeat(4)
						)
					);

					p.appendChild(
						editor.createInside.text(
							Jodit.INVISIBLE_SPACE.repeat(4) + 'stop'
						)
					);

					expect(p.childNodes.length).equals(3);

					range.setStart(p.firstChild, 4);
					editor.s.selectRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					expect(p.childNodes.length).equals(2);
					expect(editor.getNativeEditorValue()).equals(
						'<p>testtop</p>'
					);
				});
			});
		});
	});

	describe('Near with some inseparable element', function () {
		describe('Backspace', function () {
			it('Should remove this element like simple char', function () {
				editor.value = '<p>test<img/>test</p>';

				range.setStartAfter(
					editor.editor.firstChild.firstChild.nextSibling
				);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(editor.value).equals('<p>testtest</p>');
			});

			describe('Previous element has contenteditable false', function () {
				it('Should remove this element like simple char', function () {
					editor.value =
						'<p>test<a href="#" contenteditable="false">pop</a>|test</p>';

					setCursorToChar(editor);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					replaceCursorToChar(editor);
					expect(editor.value).equals('<p>test|test</p>');
				});
			});
		});

		describe('Delete', function () {
			it('Should remove this element like simple char', function () {
				editor.value = '<p>test<img/>test</p>';

				range.setStartBefore(
					editor.editor.firstChild.firstChild.nextSibling
				);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

				expect(editor.value).equals('<p>testtest</p>');
			});

			describe('Next element has contenteditable false', function () {
				it('Should remove this element like simple char', function () {
					editor.value =
						'<p>test<a href="#" contenteditable="false">pop</a>test</p>';

					range.setStartBefore(
						editor.editor.firstChild.firstChild.nextSibling
					);
					editor.s.selectRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					expect(editor.value).equals('<p>testtest</p>');
				});
			});
		});
	});

	describe('inside empty P', function () {
		describe('Backspace', function () {
			it('Should remove empty tag', function () {
				editor.value = '<p>|<br></p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				editor.s.insertNode(editor.createInside.text(' 2 '));

				expect(editor.value).equals('<p> 2 </p>');
			});

			describe('Near has element', function () {
				it('Should remove empty tag and set cursor in previous element', function () {
					editor.value =
						'<table><tbody>' +
						'<tr><td>1</td></tr>' +
						'</tbody></table><p><br></p>';

					const range = editor.s.createRange();

					range.setStartBefore(editor.editor.lastChild.firstChild);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					editor.s.insertNode(editor.createInside.text(' 2 '));

					expect(editor.value).equals(
						'<table><tbody>' +
							'<tr><td>1 2 </td></tr>' +
							'</tbody></table>'
					);
				});

				describe('For formatted HTML', function () {
					it('Should work same', function () {
						editor.value = '<p>asdas</p>\n' + '<p><br></p>';

						const range = editor.s.createRange(true);

						range.setStartBefore(
							editor.editor.lastChild.firstChild
						);

						simulateEvent(
							'keydown',
							Jodit.KEY_BACKSPACE,
							editor.editor
						);

						editor.s.insertNode(editor.createInside.text(' 2 '));

						expect(editor.value).equals('<p>asdas 2 </p>\n');
					});
				});

				describe('Inside this element and this element empty', function () {
					it('Should remove empty this empty element', function () {
						editor.value = '<p>|<br></p>';
						setCursorToChar(editor);
						// editor.s.focus();

						simulateEvent(
							'keydown',
							Jodit.KEY_ENTER,
							editor.editor
						);

						editor.s.insertHTML('b');
						expect(editor.value).equals('<p><br></p><p>b</p>');

						simulateEvent(
							'keydown',
							Jodit.KEY_BACKSPACE,
							editor.editor
						);
						expect(editor.value).equals('<p><br></p><p><br></p>');

						simulateEvent(
							'keydown',
							Jodit.KEY_BACKSPACE,
							editor.editor
						);

						expect(editor.value).equals('<p><br></p>');

						simulateEvent(
							'keydown',
							Jodit.KEY_BACKSPACE,
							editor.editor
						);

						expect(editor.value).equals('<p><br></p>');

						simulateEvent(
							'keydown',
							Jodit.KEY_BACKSPACE,
							editor.editor
						);

						expect(editor.value).equals('<p><br></p>');
					});
				});
			});
		});

		describe('Delete', function () {
			it('Should remove empty tag', function () {
				editor.value = '<p>|<br></p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

				editor.s.insertNode(editor.createInside.text(' 2 '));

				expect(editor.value).equals('<p> 2 </p>');
			});

			describe('Near has element', function () {
				it('Should remove empty tag and set cursor in next element', function () {
					editor.value =
						'<p><br>|</p><table><tbody>' +
						'<tr><td></td></tr>' +
						'</tbody></table>';

					setCursorToChar(editor);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					editor.s.insertNode(editor.createInside.text(' 2 '));

					expect(editor.value).equals(
						'<table><tbody>' +
							'<tr><td> 2 </td></tr>' +
							'</tbody></table>'
					);
				});
			});
		});
	});

	describe('near empty tag', function () {
		describe('BR before P', function () {
			it('Should simple remove BR but cursor should leave inside P', function () {
				editor.value = '<br><p>test</p>';

				// set cursor in start of element

				range.setStartBefore(editor.editor.lastChild.firstChild);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				editor.s.insertNode(editor.createInside.text(' 2 '));
				expect(editor.value).equals('<p> 2 test</p>');
			});
		});

		describe('HR before P', function () {
			it('Should simple remove HR but cursor should leave inside P', function () {
				editor.value = '<p>lets</p><hr><p>|test</p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				editor.s.insertNode(editor.createInside.text(' 2 '));
				expect(editor.value).equals('<p>lets</p><p> 2 test</p>');
			});

			describe('HR has different display style', function () {
				it('Should also remove HR but cursor should leave inside P', function () {
					const editor = getJodit({
						iframe: true,
						iframeStyle:
							Jodit.defaultOptions.iframeStyle +
							'hr {display: inline-block;}'
					});

					editor.value = '<p>lets</p><hr><p>test</p>';

					const range = editor.s.createRange();

					// set cursor in start of element

					range.selectNodeContents(editor.editor.lastChild);
					range.collapse(true);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					editor.s.insertNode(editor.createInside.text(' 2 '));
					expect(editor.value).equals('<p>lets</p><p> 2 test</p>');
				});
			});
		});

		describe('The neighbor is empty H1', function () {
			describe('Backspace', function () {
				it('Should simple remove this H1', function () {
					editor.value = '<h1></h1><p>test</p>';

					range.setStartBefore(editor.editor.lastChild.firstChild);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(editor.value).equals('<p>test</p>');
				});

				describe('H1 with BR', function () {
					it('Should simple remove this H1', function () {
						const editor = getJodit();

						editor.value = '<h1><br></h1><p>|test</p>';
						setCursorToChar(editor);

						simulateEvent(
							'keydown',
							Jodit.KEY_BACKSPACE,
							editor.editor
						);

						expect(editor.value).equals('<p>test</p>');
					});
				});
			});

			describe('Delete', function () {
				it('Should simple remove this H1', function () {
					const editor = getJodit();

					editor.value = '<p>test|</p><h1></h1>';
					setCursorToChar(editor);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					expect(editor.value).equals('<p>test</p>');
				});

				describe('H1 with BR', function () {
					it('Should simple remove this H1', function () {
						const editor = getJodit();

						editor.value = '<p>test|</p><h1><br></h1>';
						setCursorToChar(editor);
						simulateEvent(
							'keydown',
							Jodit.KEY_DELETE,
							editor.editor
						);

						expect(editor.value).equals('<p>test</p>');
					});
				});
			});
		});
	});

	describe('inside empty TD', function () {
		it('Should doing nothing', function () {
			const editor = getJodit();

			editor.value =
				'<table><tbody>' + '<tr><td></td></tr>' + '</tbody></table>';

			editor.s.setCursorIn(editor.editor.querySelector('td'));

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			expect(
				'<table><tbody>' + '<tr><td></td></tr>' + '</tbody></table>'
			).equals(editor.value);

			editor.s.focus();
			editor.s.insertNode(editor.createInside.text(' 2 '));

			expect(
				'<table><tbody>' + '<tr><td> 2 </td></tr>' + '</tbody></table>'
			).equals(editor.value);
		});
	});

	describe('after last char inside tag', function () {
		describe('inside A', function () {
			it('Should remove empty tag and set cursor in previous element', function () {
				editor.value = '<p><a href="#test">t|</a></p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(editor.value).equals('<p><br></p>');
			});
		});

		describe('inside P', function () {
			it('Should not remove empty tag', function () {
				editor.value = '<p>r</p><p>t</p>';

				editor.s.setCursorIn(editor.editor.lastChild, false);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(editor.value).equals('<p>r</p><p><br></p>');
			});
		});
	});

	describe('Cursor after/before element', function () {
		describe('Backspace key', function () {
			it('Should remove that element', function () {
				const editor = getJodit();
				editor.value = '<p><img src="tests/artio.jpg"/>|test</p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect('<p>test</p>').equals(editor.value);

				editor.s.insertNode(editor.createInside.text(' a '));
				expect('<p> a test</p>').equals(editor.value);
			});

			describe('After P before Table', function () {
				it('Should remove P', function () {
					const editor = getJodit();
					editor.value =
						'<p><br></p><table><tbody><tr><td>1</td></tr></tbody></table>';

					const range = editor.s.createRange();

					range.setStartAfter(editor.editor.firstChild);
					range.collapse(true);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(editor.value).equals(
						'<table><tbody><tr><td>1</td></tr></tbody></table>'
					);

					editor.s.insertNode(editor.createInside.text(' a '));
					expect(editor.value).equals(
						'<p> a </p><table><tbody><tr><td>1</td></tr></tbody></table>'
					);
				});
			});
		});

		describe('Delete key', function () {
			it('Should remove that element', function () {
				const editor = getJodit();
				editor.value = '<p>test|<img src="tests/artio.jpg"/></p>';
				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

				expect('<p>test</p>').equals(editor.value);

				editor.s.insertNode(editor.createInside.text(' a '));
				expect('<p>test a </p>').equals(editor.value);
			});
		});
	});

	describe('After contenteditable false', () => {
		it('Should remove this element', () => {
			const editor = getJodit();
			editor.value =
				'<div data-jodit-page-break="true" contenteditable="false">Page break</div><p>|<br></p>';
			setCursorToChar(editor);

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

			expect('<p><br></p>').equals(editor.value);
		});
	});

	describe('On the edge of two tag', function () {
		describe('Backspace', function () {
			it('Should connect both elements in one element', function () {
				editor.value = '<p>Test</p><p>Test</p>';

				range.setStart(editor.editor.lastChild.firstChild, 0);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(sortAttributes(editor.value)).equals('<p>TestTest</p>');

				editor.s.insertHTML(' a ');
				expect(editor.value).equals('<p>Test a Test</p>');
			});

			describe('inline elements', function () {
				it('Should move cursor inside first element', function () {
					editor.value =
						'<div><span style="color: rgb(0, 0, 255);">This is</span></div>\n' +
						'<div><span style="color: rgb(0, 0, 255);">my line</span></div>';

					range.setStart(
						editor.editor.querySelectorAll('span')[1].firstChild,
						0
					);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(sortAttributes(editor.value)).equals(
						'<div><span style="color:#0000FF">This is</span><span style="color:#0000FF">my line</span></div>\n'
					);

					editor.s.insertHTML(' a ');
					expect(sortAttributes(editor.value)).equals(
						'<div><span style="color:#0000FF">This is</span><span style="color:#0000FF"> a my line</span></div>\n'
					);
				});
			});

			describe('Several elements', function () {
				it('Should connect both elements in one element and move all children in previous element', function () {
					editor.value =
						'<div><span>This is</span></div>\n' +
						'<div><span>|my line</span><strong>test</strong></div>';

					setCursorToChar(editor);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(sortAttributes(editor.value)).equals(
						'<div><span>This is</span><span>my line</span><strong>test</strong></div>\n'
					);
				});

				describe('Different elements', function () {
					it('Should move content', function () {
						editor.value =
							'<div><span>This is</span></div>\n' +
							'<div><strong>|my line</strong><strong>test</strong></div>';

						setCursorToChar(editor);

						simulateEvent(
							'keydown',
							Jodit.KEY_BACKSPACE,
							editor.editor
						);

						expect(sortAttributes(editor.value)).equals(
							'<div><span>This is</span><strong>my line</strong><strong>test</strong></div>\n'
						);
					});
				});
			});

			describe('P after UL and cursor in the left edge of P', function () {
				it('Should remove P and move all this content inside last LI', function () {
					editor.value =
						'<p>AAA</p>\n' +
						'<ul>\n' +
						'    <li>BBB</li>\n' +
						'    <li>BBB</li>\n' +
						'    <li>BBB</li>\n' +
						'</ul><p>CCC</p>';

					range.setStart(editor.editor.lastChild.firstChild, 0);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(sortAttributes(editor.value)).equals(
						'<p>AAA</p>\n' +
							'<ul>\n' +
							'    <li>BBB</li>\n' +
							'    <li>BBB</li>\n' +
							'    <li>BBBCCC</li>\n' +
							'</ul>'
					);

					editor.s.insertHTML(' a ');
					expect(editor.value).equals(
						'<p>AAA</p>\n' +
							'<ul>\n' +
							'    <li>BBB</li>\n' +
							'    <li>BBB</li>\n' +
							'    <li>BBB a CCC</li>\n' +
							'</ul>'
					);
				});
			});

			describe('H1 after P and cursor in the left edge of H1', function () {
				it('Should remove H1 and move all this content inside last P', function () {
					editor.value = '<p>AAA</p><h1>CCC</h1>';

					range.setStart(editor.editor.lastChild.firstChild, 0);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(sortAttributes(editor.value)).equals(
						'<p>AAACCC</p>'
					);
				});
			});

			describe('Space between two elements', function () {
				it('Should connect both elements in one element', function () {
					editor.value = '<p>Test</p> \n <p>Test</p>';

					range.setStart(editor.editor.lastChild.firstChild, 0);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(sortAttributes(editor.value)).equals(
						'<p>TestTest</p> \n '
					);

					editor.s.insertHTML(' a ');
					expect(editor.value).equals('<p>Test a Test</p> \n ');
				});
			});
		});

		describe('Delete', function () {
			it('Should connect both elements in one element', function () {
				editor.value = '<p>Test</p><p>Test</p>';

				range.setStartAfter(editor.editor.firstChild.firstChild);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

				expect(sortAttributes(editor.value)).equals('<p>TestTest</p>');

				editor.s.insertHTML(' a ');
				expect(editor.value).equals('<p>Test a Test</p>');
			});
		});
	});

	describe('In the middle of two UL elements', function () {
		describe('Backspace', function () {
			describe('In first LI of second UL', function () {
				it('Should move content of this LI and put it inside new P', function () {
					editor.value =
						'<ul><li>Test</li></ul><ul><li>|Some text</li></ul>';

					setCursorToChar(editor);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(sortAttributes(editor.value)).equals(
						'<ul><li>Test</li></ul><p>Some text</p>'
					);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(sortAttributes(editor.value)).equals(
						'<ul><li>Test</li></ul><p> a Some text</p>'
					);
				});
			});

			describe('In the P element', function () {
				it('Should connect both UL in one element', function () {
					editor.value =
						'<ul><li>Test</li></ul><p>|<br></p><ul><li>Some text</li></ul>';

					setCursorToChar(editor);

					editor.s.focus();

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect(sortAttributes(editor.value)).equals(
						'<ul><li>Test</li><li>Some text</li></ul>'
					);

					editor.s.focus();
					editor.s.insertNode(editor.createInside.text(' a '));
					expect(editor.value).equals(
						'<ul><li>Test a </li><li>Some text</li></ul>'
					);
				});
			});
		});

		describe('Delete', function () {
			describe('In last LI of first UL', function () {
				it('Should connect both UL in one element', function () {
					editor.value =
						'<ul><li>Test|</li></ul><ul><li>Some text</li></ul>';

					setCursorToChar(editor);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					expect(sortAttributes(editor.value)).equals(
						'<p>Test</p><ul><li>Some text</li></ul>'
					);

					editor.s.insertNode(editor.createInside.text(' a '));

					expect(sortAttributes(editor.value)).equals(
						'<p>Test a </p><ul><li>Some text</li></ul>'
					);
				});
			});

			describe('In the P element', function () {
				it('Should connect both UL in one element', function () {
					editor.value =
						'<ul><li>Test</li><li> </li><li>Some text</li></ul>';

					range.setStart(editor.editor.firstChild.childNodes[1], 0);
					editor.s.selectRange(range);

					simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

					expect(sortAttributes(editor.value)).equals(
						'<ul><li>Test</li></ul><p><br></p><ul><li>Some text</li></ul>'
					);

					editor.s.focus();
					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

					expect(sortAttributes(editor.value)).equals(
						'<ul><li>Test</li><li>Some text</li></ul>'
					);

					editor.s.focus();
					editor.s.insertNode(editor.createInside.text(' a '));
					expect(editor.value).equals(
						'<ul><li>Test</li><li> a Some text</li></ul>'
					);
				});
			});
		});
	});

	describe('Enter backspace/delete in the start of some LI', function () {
		describe('in first LI', function () {
			describe('Enter backspace', function () {
				it('Should remove this LI and move all conntent in P', function () {
					editor.value = '<ul><li>Test</li><li>Some text</li></ul>';

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					editor.s.selectRange(range);

					simulateEvent(
						'keydown',
						Jodit.KEY_BACKSPACE,
						editor.editor
					);

					expect('<p>Test</p><ul><li>Some text</li></ul>').equals(
						editor.value
					);

					editor.s.insertNode(editor.createInside.text(' a '));
					expect('<p> a Test</p><ul><li>Some text</li></ul>').equals(
						editor.value
					);
				});
			});

			describe('Enter delete', function () {
				it('Should remove all text content and after this remove that LI', function () {
					editor.value =
						'<ul><li>' +
						Jodit.INVISIBLE_SPACE +
						'</li><li>Some text</li></ul>';

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					editor.s.selectRange(range);

					simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);
					expect('<ul><li>Some text</li></ul>').equals(editor.value);

					editor.s.insertNode(editor.createInside.text(' a '));
					expect('<ul><li> a Some text</li></ul>').equals(
						editor.value
					);
				});
			});
		});

		describe('in alone LI', function () {
			it('Should remove this LI and UL and move all content in P', function () {
				editor.value = '<ul><li>Test</li></ul>';

				range.setStart(
					editor.editor.firstChild.childNodes[0].firstChild,
					0
				);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect('<p>Test</p>').equals(editor.value);

				editor.s.insertNode(editor.createInside.text(' a '));
				expect('<p> a Test</p>').equals(editor.value);
			});
		});

		it('Should connect this LI with previous', function () {
			editor.value = '<ul><li>Test</li><li>Some text</li></ul>';

			range.setStart(
				editor.editor.firstChild.childNodes[1].firstChild,
				0
			);

			editor.s.selectRange(range);

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

			expect(editor.value).equals('<ul><li>TestSome text</li></ul>');

			editor.s.insertNode(editor.createInside.text(' a '));
			expect(editor.value).equals('<ul><li>Test a Some text</li></ul>');
		});

		describe('And enter Enter', function () {
			it('Should split this LI on two again', function () {
				editor.value = '<ul><li>Test</li><li>Some text</li></ul>';

				range.setStart(
					editor.editor.firstChild.childNodes[1].firstChild,
					0
				);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
				simulateEvent('keyup', Jodit.KEY_BACKSPACE, editor.editor);

				expect('<ul><li>TestSome text</li></ul>').equals(editor.value);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

				expect(editor.value).equals(
					'<ul><li>Test</li><li>Some text</li></ul>'
				);
			});
		});
	});
});
