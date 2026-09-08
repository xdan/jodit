/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Selection Module Tests', function () {
	describe('Selection boundary regressions', () => {
		['<p>ab|cd</p>', '<p>a|bc|d</p>', '<p>a|b</p><p>c|d</p>'].forEach(
			source => {
				['markers', 'fakes'].forEach(strategy => {
					it(`Should round-trip ${strategy} for ${source}`, () => {
						const editor = getJodit();
						editor.value = source;
						setCursorToChar(editor);
						const collapsed = editor.s.isCollapsed();
						const selected = editor.s.sel.toString();

						if (strategy === 'markers') {
							editor.s.save();
							editor.s.restore();
						} else {
							const fakes = editor.s.fakes();
							expect(fakes.length).equals(collapsed ? 1 : 2);
							editor.s.restoreFakes(fakes);
							expect(fakes.every(node => !node.isConnected)).is
								.true;
						}

						expect(editor.s.isCollapsed()).equals(collapsed);
						expect(editor.s.sel.toString()).equals(selected);
						expect(editor.s.hasMarkers).is.false;
						replaceCursorToChar(editor);
						expect(editor.value).equals(source);
					});
				});
			}
		);

		[true, false].forEach(collapsed => {
			it(`Should keep a saved selection active in Shadow DOM (collapsed: ${collapsed})`, () => {
				const root = appendTestDiv().attachShadow({ mode: 'open' });
				root.innerHTML = '<div></div>';
				const editor = getJodit(
					{ shadowRoot: root, globalFullSize: false },
					root.firstChild
				);
				editor.value = '<p>abcd</p>';
				const range = editor.s.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 1);
				range.setEnd(
					editor.editor.firstChild.firstChild,
					collapsed ? 1 : 3
				);
				editor.s.selectRange(range);

				const saved = editor.s.save();

				expect(saved.length).equals(1);
				expect(editor.s.sel.rangeCount).equals(1);
				expect(editor.s.isInsideArea).is.true;
				editor.s.restore();
				expect(editor.s.sel.toString()).equals(collapsed ? '' : 'bc');
				expect(editor.s.isCollapsed()).equals(collapsed);
				expect(editor.s.hasMarkers).is.false;
			});
		});

		it('Should ignore fake nodes moved outside the editor', () => {
			const editor = getJodit();
			editor.value = '<p>ab|cd</p>';
			setCursorToChar(editor);
			const fakes = editor.s.fakes();
			const outside = appendTestDiv();
			outside.appendChild(fakes[0]);
			editor.s.setCursorIn(editor.editor.firstChild, true);
			const range = editor.s.range.cloneRange();

			editor.s.restoreFakes(fakes);

			expect(editor.s.range.startContainer).equals(range.startContainer);
			expect(editor.s.range.startOffset).equals(range.startOffset);
			expect(outside.firstChild).equals(fakes[0]);
		});

		it('Should clean up temporary wrappers when iteration stops early', () => {
			const editor = getJodit();
			editor.value = '<p>|one</p><p>two|</p>';
			setCursorToChar(editor);
			const gen = editor.s.wrapInTagGen();
			expect(gen.next().value.tagName).equals('FONT');
			gen.return();

			expect(editor.editor.querySelector('font')).is.null;
			expect(editor.value).equals('<p>one</p><p>two</p>');
		});

		it('Should resolve the last text descendant after a nested element', () => {
			const editor = getJodit();
			editor.value = '<p><b>first</b><i>last</i></p>';
			const range = editor.s.createRange();
			range.setStart(editor.editor, 1);
			range.collapse(true);
			editor.s.selectRange(range);

			expect(editor.s.current()).equals(
				editor.editor.querySelector('i').firstChild
			);
		});

		it('Should check the end container of a selection across blocks', () => {
			const editor = getJodit();
			editor.value = '<p>o|ne</p><p>two|</p>';
			setCursorToChar(editor);

			expect(editor.s.cursorOnTheRight(editor.editor.lastChild)).is.true;
			expect(editor.s.cursorOnTheRight(editor.editor.firstChild)).is.null;
			expect(editor.s.cursorOnTheLeft(editor.editor.firstChild)).is.false;
		});

		it('Should check only siblings after the selected end', () => {
			const editor = getJodit();
			editor.value = '<p><b>o|ne</b><i>two|</i></p>';
			setCursorToChar(editor);

			expect(editor.s.cursorOnTheRight(editor.editor.firstChild)).is.true;
		});

		[0, 1].forEach(offset => {
			it(`Should recognize an element boundary at offset ${offset}`, () => {
				const editor = getJodit();
				editor.value = '<p><b>one</b></p>';
				const block = editor.editor.firstChild;
				const range = editor.s.createRange();
				range.setStart(block, offset);
				range.collapse(true);
				editor.s.selectRange(range);

				expect(editor.s.cursorOnTheLeft(block)).equals(offset === 0);
				expect(editor.s.cursorOnTheRight(block)).equals(offset === 1);
			});
		});

		[false, true].forEach(includeSibling => {
			it(`Should preserve an element end offset when splitting the start text (${includeSibling})`, () => {
				const editor = getJodit();
				editor.value = '<p>abcd<i>ef</i>gh</p>';
				const block = editor.editor.firstChild;
				const range = editor.s.createRange();
				range.setStart(block.firstChild, 2);
				range.setEnd(block, includeSibling ? 2 : 1);
				editor.s.selectRange(range);

				editor.s.wrapInTag('span');

				expect(editor.value).equals(
					includeSibling
						? '<p>ab<span>cd<i>ef</i></span>gh</p>'
						: '<p>ab<span>cd</span><i>ef</i>gh</p>'
				);
			});
		});

		it('Should remove all temporary wrappers when a callback throws', () => {
			const editor = getJodit();
			editor.value = '<p>|one</p><p>two|</p>';
			setCursorToChar(editor);
			const failure = new Error('Callback failed');

			expect(() =>
				editor.s.wrapInTag(() => {
					throw failure;
				})
			).to.throw(failure);
			expect(editor.editor.querySelector('font')).is.null;
			expect(editor.value).equals('<p>one</p><p>two</p>');
		});

		['save', 'fakes', 'remove', 'wrapInTag'].forEach(method => {
			it(`Should leave a selection crossing the editor boundary untouched in ${method}`, () => {
				const editor = getJodit();
				editor.value = '<p>inside</p>';
				const outside = appendTestDiv();
				outside.textContent = 'outside';
				const range = editor.s.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.setEnd(outside.firstChild, 3);
				const sel = editor.s.sel;
				sel.removeAllRanges();
				sel.addRange(range);
				const selected = sel.toString();

				if (method === 'wrapInTag') {
					editor.s.wrapInTag('span');
				} else {
					editor.s[method]();
				}

				expect(editor.editor.innerHTML).equals('<p>inside</p>');
				expect(outside.innerHTML).equals('outside');
				expect(sel.toString()).equals(selected);
			});
		});

		it('Should require both selection boundaries to be inside the editor', () => {
			const editor = getJodit();
			editor.value = '<p>inside</p>';
			const outside = appendTestDiv();
			outside.textContent = 'outside';
			const range = editor.s.createRange();
			range.setStart(editor.editor.firstChild.firstChild, 0);
			range.setEnd(outside.firstChild, 1);
			editor.s.sel.removeAllRanges();
			editor.s.sel.addRange(range);

			expect(editor.s.isInsideArea).is.false;
		});

		it('Should not return a BR outside the editor as current', () => {
			const editor = getJodit();
			const outside = appendTestDiv();
			outside.innerHTML = '<br>';
			const range = editor.s.createRange();
			range.setStart(outside.firstChild, 0);
			range.collapse(true);
			editor.s.sel.removeAllRanges();
			editor.s.sel.addRange(range);

			expect(editor.s.current()).is.null;
		});
	});

	describe('insertHTML after the editor lost focus (#1239)', function () {
		it('Should insert at the previous caret position, not at the start', function () {
			const editor = getJodit();

			editor.value = '<p>start|end</p>';
			editor.s.focus();
			setCursorToChar(editor);

			// focus an external control — the editor blurs, like clicking
			// a non-focusable <dt>/<a> element on the page
			const input = document.createElement('input');
			document.body.appendChild(input);

			try {
				input.focus();
				simulateEvent('blur', editor.editor);

				expect(editor.s.isFocused()).is.false;

				editor.s.insertHTML('XXX');

				expect(editor.value).equals('<p>startXXXend</p>');
			} finally {
				input.remove();
			}
		});
	});

	describe('Current method', function () {
		describe('Cursor outside the editor', function () {
			it('Should return false', function () {
				const editor = getJodit(),
					div = document.createElement('div');

				div.innerHTML = 'test';
				document.body.appendChild(div);
				editor.value = '<h1>test <span>test</span>sdfsdfds</h1>';
				const range = document.createRange();
				range.setStart(div.firstChild, 1);
				range.setEnd(div.firstChild, 2);
				const sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);

				expect(editor.s.current()).is.null;
				document.body.removeChild(div);
			});
		});

		describe('Cursor in the left of some SPAN', function () {
			it('Should return text before this span', function () {
				const editor = getJodit();
				editor.value = '<h1>one<span>two</span>tree</h1>';
				const range = editor.s.createRange();
				range.setStart(editor.editor.firstChild, 1);
				range.collapse(true);

				editor.s.selectRange(range);

				expect(editor.s.current()).equals(
					editor.editor.firstChild.firstChild
				); //one
			});
		});

		describe('Cursor inside the text node ', function () {
			it('Should return text', function () {
				const editor = getJodit();
				editor.value = '<h1>test</h1>';
				const range = editor.s.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 1);
				range.collapse(true);
				editor.s.selectRange(range);

				expect(editor.s.current()).equals(
					editor.editor.firstChild.firstChild
				); // test
			});
		});

		describe('Cursor after h1', function () {
			it('Should return text inside h1', function () {
				const editor = getJodit();
				editor.value = '<h1>test</h1>';
				const range = editor.s.createRange();
				range.setStart(editor.editor, 1);
				range.collapse(true);
				editor.s.selectRange(range);

				expect(editor.s.current()).equals(
					editor.editor.firstChild.firstChild
				); // test
			});

			describe('With false argument', function () {
				it('Should return h1', function () {
					const editor = getJodit();
					editor.value = '<h1>test</h1>';
					const range = editor.s.createRange();
					range.setStart(editor.editor, 1);
					range.collapse(true);
					editor.s.selectRange(range);

					expect([
						editor.editor.firstChild,
						editor.editor.firstChild.firstChild
					]).to.include(editor.s.current(false)); // h1
				});
			});
		});

		describe('Select img', function () {
			it('Should return this image', function () {
				const editor = getJodit();
				editor.value = '<h1>test <img src="#" alt=""> sdfsdfs</h1>';
				const range = editor.s.createRange();
				range.selectNode(editor.editor.querySelector('img'));
				editor.s.selectRange(range);

				expect(editor.s.current()).equals(
					editor.editor.querySelector('img')
				);
			});
		});
	});

	describe('cursorInTheEdge', function () {
		describe('Without any selection', function () {
			it('Should return null and do not throw', function () {
				const editor = getJodit();
				editor.value = '<p>test</p>';

				const sel = editor.s.sel;
				sel && sel.removeAllRanges();

				expect(editor.s.cursorInTheEdge(true, editor.editor.firstChild))
					.is.null;
				expect(
					editor.s.cursorInTheEdge(false, editor.editor.firstChild)
				).is.null;
			});
		});

		describe('Cursor in the text', function () {
			describe('cursorOnTheLeft and cursorOnTheRight', function () {
				describe('Cursor inside P but inside Li', function () {
					describe('Cursor in the end of text node', function () {
						it('Should work correct', function () {
							const editor = getJodit();
							editor.value = '<ul><li><p>test|</p></li></ul>';
							setCursorToChar(editor);

							['li', 'p'].forEach(function (tag) {
								expect(
									editor.s.cursorOnTheLeft(
										editor.editor.querySelector(tag)
									)
								).is.false;

								expect(
									editor.s.cursorOnTheRight(
										editor.editor.querySelector(tag)
									)
								).is.true;
							});
						});
					});

					describe('Cursor in the start of text node', function () {
						it('Should work correct', function () {
							const editor = getJodit();
							editor.value = '<ul><li><p>test</p></li></ul>';

							const range = editor.s.createRange();

							range.setStartBefore(
								editor.editor.querySelector('p').firstChild
							);
							range.collapse(true);
							editor.s.selectRange(range);

							['li', 'p'].forEach(function (tag) {
								expect(
									editor.s.cursorOnTheLeft(
										editor.editor.querySelector(tag)
									)
								).is.true;

								expect(
									editor.s.cursorOnTheRight(
										editor.editor.querySelector(tag)
									)
								).is.false;
							});
						});
					});
				});
			});

			describe('Cursor in the end of text node but after this has BR', function () {
				it('Should return true', function () {
					const editor = getJodit();
					editor.value = '<p>test<br></p>';

					const range = editor.s.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 4);
					range.collapse(true);
					editor.s.selectRange(range);

					expect(editor.s.cursorOnTheRight(editor.editor.firstChild))
						.is.true;
				});
			});

			describe('Cursor in the end of text node but after this has image', function () {
				it('Should return false', function () {
					const editor = getJodit();
					editor.value = '<p>test|<img/></p>';
					setCursorToChar(editor);

					expect(editor.s.cursorOnTheRight(editor.editor.firstChild))
						.is.false;
				});
			});

			describe('Cursor in the middle of text node', function () {
				it('Should return false', function () {
					const editor = getJodit();
					editor.value = '<p>test</p>';

					const range = editor.s.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 2);
					range.collapse(true);
					editor.s.selectRange(range);

					expect(editor.s.cursorOnTheRight(editor.editor.firstChild))
						.is.false;
				});

				describe('Cursor in the middle of text node but after cursor only invisible spaces', function () {
					it('Should return true', function () {
						const editor = getJodit();
						editor.value =
							'<p>test' +
							Jodit.INVISIBLE_SPACE +
							Jodit.INVISIBLE_SPACE +
							Jodit.INVISIBLE_SPACE +
							'</p>';

						const range = editor.s.createRange();

						range.setStart(editor.editor.firstChild.firstChild, 4);
						range.collapse(true);
						editor.s.selectRange(range);

						expect(
							editor.s.cursorOnTheRight(editor.editor.firstChild)
						).is.true;
					});
				});
				describe('Cursor in the middle of text node but before cursor only invisible spaces', function () {
					it('Should return true', function () {
						const editor = getJodit();
						editor.value =
							'<p>' +
							Jodit.INVISIBLE_SPACE +
							Jodit.INVISIBLE_SPACE +
							Jodit.INVISIBLE_SPACE +
							'test</p>';

						const range = editor.s.createRange();

						range.setStart(editor.editor.firstChild.firstChild, 3);
						range.collapse(true);
						editor.s.selectRange(range);

						expect(
							editor.s.cursorOnTheLeft(editor.editor.firstChild)
						).is.true;
					});
				});

				describe('Cursor in the end of text node but after this has several not empty text nodes', function () {
					it('Should return false', function () {
						const editor = getJodit();
						editor.value = '<p>test</p>';

						const range = editor.s.createRange();

						range.setStart(editor.editor.firstChild.firstChild, 4);
						range.collapse(true);
						editor.s.selectRange(range);
						editor.s.insertNode(editor.createInside.text('a'));

						range.setStart(editor.editor.firstChild.firstChild, 4);
						range.collapse(true);
						editor.s.selectRange(range);

						expect(
							editor.s.cursorOnTheRight(editor.editor.firstChild)
						).is.false;
					});

					describe('Cursor in the end of text node and after are only text nodes with invisible spaces', function () {
						it('Should return true', function () {
							const editor = getJodit();
							editor.value = '<p>test</p>';

							const range = editor.s.createRange();

							range.setStart(
								editor.editor.firstChild.firstChild,
								4
							);
							range.collapse(true);
							editor.s.selectRange(range);

							editor.s.insertNode(
								editor.createInside.text(Jodit.INVISIBLE_SPACE)
							);
							editor.s.insertNode(
								editor.createInside.text(Jodit.INVISIBLE_SPACE)
							);
							editor.s.insertNode(
								editor.createInside.text(Jodit.INVISIBLE_SPACE)
							);

							range.setStart(
								editor.editor.firstChild.firstChild,
								4
							);
							range.collapse(true);
							editor.s.selectRange(range);

							expect(
								editor.s.cursorOnTheRight(
									editor.editor.firstChild
								)
							).is.true;
						});
					});

					describe('Inverse', function () {
						describe('Cursor in the start of text node but before this has several not empty text nodes', function () {
							it('Should return false', function () {
								const editor = getJodit();
								editor.value = '<p>test</p>';

								const range = editor.s.createRange();

								range.setStart(
									editor.editor.firstChild.firstChild,
									0
								);
								range.collapse(true);
								editor.s.selectRange(range);
								editor.s.insertNode(
									editor.createInside.text('a')
								);

								range.setStart(
									editor.editor.firstChild.lastChild,
									0
								);
								range.collapse(true);
								editor.s.selectRange(range);

								expect(
									editor.s.cursorOnTheLeft(
										editor.editor.firstChild
									)
								).is.false;
							});
							describe('Cursor in the start of text node and before are only text nodes with invisible spaces', function () {
								it('Should return true', function () {
									const editor = getJodit();
									editor.value = '<p>test</p>';

									const range = editor.s.createRange();

									range.setStart(
										editor.editor.firstChild.firstChild,
										0
									);
									range.collapse(true);
									editor.s.selectRange(range);

									editor.s.insertNode(
										editor.createInside.text(
											Jodit.INVISIBLE_SPACE
										)
									);
									editor.s.insertNode(
										editor.createInside.text(
											Jodit.INVISIBLE_SPACE
										)
									);
									editor.s.insertNode(
										editor.createInside.text(
											Jodit.INVISIBLE_SPACE
										)
									);

									range.setStart(
										editor.editor.firstChild.lastChild,
										0
									);
									range.collapse(true);
									editor.s.selectRange(range);

									expect(
										editor.s.cursorOnTheLeft(
											editor.editor.firstChild
										)
									).is.true;
								});
							});
						});
					});
				});
			});
		});

		describe('Cursor after element', function () {
			it('Should return null', function () {
				const editor = getJodit();
				editor.value = '<p>test</p>';

				const range = editor.s.createRange();

				range.setStartAfter(editor.editor.firstChild);
				range.collapse(true);
				editor.s.selectRange(range);

				expect(editor.s.cursorOnTheRight(editor.editor.firstChild)).is
					.null;
			});
		});

		describe('Cursor before element', function () {
			it('Should return null', function () {
				const editor = getJodit();
				editor.value = '<p>test</p>';

				const range = editor.s.createRange();

				range.setStartBefore(editor.editor.firstChild);
				range.collapse(true);
				editor.s.selectRange(range);

				expect(editor.s.cursorOnTheLeft(editor.editor.firstChild)).is
					.null;
			});
		});

		describe('Cursor in the start of element ', function () {
			it('Should return true', function () {
				const editor = getJodit();
				editor.value = '<p><span>test</span></p>';

				const range = editor.s.createRange();

				range.setStartBefore(editor.editor.firstChild.firstChild);
				range.collapse(true);
				editor.s.selectRange(range);

				expect(editor.s.cursorOnTheLeft(editor.editor.firstChild)).is
					.true;
			});
		});

		describe('Cursor in the end of element ', function () {
			it('Should return true', function () {
				const editor = getJodit();
				editor.value = '<p><span>test</span></p>';

				const range = editor.s.createRange();

				range.setStartAfter(editor.editor.firstChild.firstChild);
				range.collapse(true);
				editor.s.selectRange(range);

				expect(editor.s.cursorOnTheRight(editor.editor.firstChild)).is
					.true;
			});
		});

		describe('Cursor not in the end of element ', function () {
			it('Should return false', function () {
				const editor = getJodit();
				editor.value = '<p><span>test</span><span>stop</span></p>';

				const range = editor.s.createRange();

				range.setStartAfter(editor.editor.firstChild.firstChild);
				range.collapse(true);
				editor.s.selectRange(range);

				expect(editor.s.cursorOnTheRight(editor.editor.firstChild)).is
					.false;
			});
		});

		describe('Cursor not in the start of element ', function () {
			it('Should return false', function () {
				const editor = getJodit();
				editor.value = '<p><span>test</span><span>stop</span></p>';

				const range = editor.s.createRange();

				range.setStartAfter(editor.editor.firstChild.firstChild);
				range.collapse(true);
				editor.s.selectRange(range);

				expect(editor.s.cursorOnTheLeft(editor.editor.firstChild)).is
					.false;
			});
		});

		describe('If cursor in the end of P', function () {
			it('Should return true', function () {
				const editor = getJodit();
				editor.value = '<p>test</p>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 4);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				expect(editor.s.cursorOnTheRight(editor.editor.firstChild)).is
					.true;

				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				expect(editor.s.cursorOnTheRight(editor.editor.firstChild)).is
					.false;
			});
		});

		describe('If cursor in the end of SPAN in the end of P', function () {
			it('Should return true', function () {
				const editor = getJodit();
				editor.value = '<p>test<span>1</span></p>';

				const sel = editor.s.sel,
					range = editor.s.createRange();

				range.selectNodeContents(editor.editor.firstChild.lastChild);
				range.collapse(false);
				sel.removeAllRanges();
				sel.addRange(range);

				expect(
					editor.s.cursorInTheEdge(false, editor.editor.firstChild)
				).is.true;
			});
		});

		describe('Cursor in the end of span inside P and check cursorInTheEdge(true)', function () {
			it('Should return false', function () {
				const editor = getJodit();
				editor.value = '<p>Some <span>|text|</span></p>';
				setCursorToChar(editor);

				expect(editor.s.cursorInTheEdge(true, editor.editor.firstChild))
					.is.false;
			});
		});
	});

	describe('Click on empty tag', function () {
		it('Should move cursore inside that', function () {
			const editor = getJodit();
			editor.value = '<p></p><p></p><p></p>';
			simulateEvent(
				'mousedown',
				0,
				editor.editor.getElementsByTagName('p')[1]
			);
			editor.s.insertHTML('test');
			expect('<p></p><p>test</p><p></p>').equals(editor.value);
		});
	});

	describe('Method setCursorIn', function () {
		describe('Call for not Node element', function () {
			it('Should throw exception', function () {
				const editor = getJodit();
				editor.value = '<p>1</p><p>2</p>';
				expect(function () {
					editor.s.setCursorIn(editor.editor.querySelector('strong'));
				}).to.throw();
			});

			describe('Call for inserted fragment', function () {
				it('Should not throw exception', function () {
					const editor = getJodit();
					editor.value = '<p>1<span>3</span>2</p>';
					editor.s.select(editor.editor.querySelector('span'));
					const fragment = editor.s.range.extractContents();
					editor.s.insertNode(fragment);
				});
			});
		});

		describe('Call for element what is not inside the current editor', function () {
			it('Should throw exception', function () {
				const editor = getJodit();
				expect(function () {
					editor.s.setCursorIn(document.body);
				}).to.throw();
			});
		});

		it('Should move cursor inside node in the end', function () {
			const editor = getJodit();
			editor.value = '<p>1</p><p>2</p>';

			editor.s.setCursorIn(editor.editor.lastChild);
			editor.s.insertHTML('test');

			expect(editor.value).equals('<p>1</p><p>2test</p>');
		});

		describe('With inStart = true', function () {
			it('Should move cursor inside node in the start', function () {
				const editor = getJodit();
				editor.value = '<p>1</p><p>2</p>';

				editor.s.setCursorIn(editor.editor.lastChild, true);
				editor.s.insertHTML('test');

				expect(editor.value).equals('<p>1</p><p>test2</p>');
			});
		});
	});

	describe('Method eachSelection', function () {
		it('Should call callback for each node in selection', function () {
			const editor = getJodit({
				disablePlugins: ['WrapNodes']
			});
			editor.value =
				'|<p>1</p><p>2</p><strong><span>22</span></strong><p>4</p>stop|';

			setCursorToChar(editor);

			const nodesNames = [];
			editor.s.eachSelection(function (node) {
				nodesNames.push(node.nodeName);
			});

			expect(nodesNames.toString().toLowerCase()).equals(
				['P', 'P', 'STRONG', 'P', '#text'].toString().toLowerCase()
			);
		});

		it('Should call callback for each node in selection range', function () {
			const editor = getJodit({ disablePlugins: ['WrapNodes'] });
			editor.value =
				'<p>1</p>|<p>2</p><strong><span>22</span></strong><p>4</p>|stop';

			setCursorToChar(editor);

			const nodesNames = [];
			editor.s.eachSelection(node => {
				nodesNames.push(node.nodeName);
			});

			expect(nodesNames.toString().toLowerCase()).equals(
				['p', 'strong', 'p'].toString().toLowerCase()
			);
		});

		it('Should not call callback for editor', function () {
			const editor = getJodit();
			editor.value = '';

			editor.s.setCursorIn(editor.editor);

			const nodesNames = [];
			editor.s.eachSelection(function (node) {
				nodesNames.push(node.nodeName);
			});

			expect(['#text'].toString().toLowerCase()).equals(
				nodesNames.toString().toLowerCase()
			);
		});

		it('Should call callback for current node if selection is collapsed', function () {
			const editor = getJodit();
			editor.value = '<p>|1</p><p>2</p>';

			setCursorToChar(editor);

			const nodeNames = [];

			editor.s.eachSelection(function (node) {
				nodeNames.push(node.nodeName);
			});

			expect(['#text'].toString().toLowerCase()).equals(
				nodeNames.toString().toLowerCase()
			);
		});

		it('Should not throw for the empty editor', function () {
			const editor = getJodit();
			editor.s.focus();
			editor.editor.innerHTML = '';

			const range = editor.s.createRange();
			range.setStart(editor.editor, 0);
			range.collapse(true);

			// set the selection natively so that nothing normalizes the empty editor
			const sel = editor.s.sel;
			sel.removeAllRanges();
			sel.addRange(range);

			const nodeNames = [];

			expect(() => {
				editor.s.eachSelection(function (node) {
					nodeNames.push(node.nodeName);
				});
			}).does.not.throw();

			expect(nodeNames.length).equals(0);
		});
	});

	describe('expandSelection', () => {
		[
			[
				'<table><tbody><tr><td>|test|</td><td>pop</td></tr></tbody></table>',
				'<table><tbody><tr><td>|test|</td><td>pop</td></tr></tbody></table>'
			],
			[
				'<table><tbody><tr><td>|test|</td></tr></tbody></table>',
				'<table><tbody><tr><td>|test|</td></tr></tbody></table>'
			],
			['<p>|test</p>', '<p>|test</p>'],
			['<p>test</p><p>|test|</p>', '<p>test</p><p>|test|</p>'],
			['<p>|test|</p>', '<p>|test|</p>'],
			[
				'<ul><li><span>|test|</span>test<s>ss</s></li></ul>',
				'<ul><li>|<span>test</span>|test<s>ss</s></li></ul>'
			],
			[
				'<ul><li><span>test|</span>test<s>ss|</s></li></ul>',
				'<ul><li><span>test|</span>test<s>ss</s>|</li></ul>'
			],
			[
				'<ul><li><span>|test</span>test<s>ss|</s></li></ul>',
				'<ul><li>|<span>test</span>test<s>ss</s>|</li></ul>'
			],
			[
				'<ul><li><span>|test</span>test<s>ss|</s>pop</li></ul>',
				'<ul><li>|<span>test</span>test<s>ss</s>|pop</li></ul>'
			],
			[
				'<ul><li><span>|test</span>test<s>|ss</s></li></ul>',
				'<ul><li>|<span>test</span>test<s>|ss</s></li></ul>'
			],
			[
				'<ul><li><span>test|</span>test<s>|ss</s></li></ul>',
				'<ul><li><span>test|</span>test<s>|ss</s></li></ul>'
			],
			[
				'<ul><li><span>te|st</span>test<s>|ss</s></li></ul>',
				'<ul><li><span>te|st</span>test<s>|ss</s></li></ul>'
			],
			[
				'<ul><li><span>|test</span>test<s>ss|</s></li><li><span>test</span>test<s>ss</s></li></ul>',
				'<ul><li>|<span>test</span>test<s>ss</s>|</li><li><span>test</span>test<s>ss</s></li></ul>'
			],
			[
				'<p>|You must include the syntax highlighting library yourself, on your site:</p>\n<pre class="language-html" contenteditable="false">...</pre>\n\n<p>After that, the library must be initialized</p>\n<pre class="language-javascript" contenteditable="false">Prism.highlightAll()|</pre>',
				'<p>|You must include the syntax highlighting library yourself, on your site:</p>\n<pre class="language-html" contenteditable="false">...</pre>\n\n<p>After that, the library must be initialized</p>\n<pre class="language-javascript" contenteditable="false">Prism.highlightAll()|</pre>'
			]
		].forEach(([source, result], i) => {
			describe(`For index ${i}  source: ${source}`, () => {
				it('Should move cursor selection', () => {
					const jodit = getJodit();
					jodit.value = source;
					setCursorToChar(jodit);
					jodit.s.expandSelection();
					replaceCursorToChar(jodit);
					expect(sortAttributes(jodit.value, ['contenteditable'])).eq(
						sortAttributes(result, ['contenteditable'])
					);
				});
			});
		});
	});

	describe('Selection module', function () {
		it('Current selection element should be inside editor', function () {
			const editor = getJodit(),
				div = document.createElement('div');

			document.body.appendChild(div);
			div.innerHTML = 'jingl';

			const sel = window.getSelection(),
				range = document.createRange();

			range.selectNodeContents(div);
			range.collapse(false);
			sel.removeAllRanges();
			sel.addRange(range);

			expect(editor.s.current()).is.null;
			div.parentNode.removeChild(div);
		});

		it('Current selection element', () => {
			const editor = getJodit({
					disablePlugins: 'WrapNodes'
				}),
				div = editor.ed.createElement('div'),
				text = editor.createInside.text('jingl');

			editor.value = '';
			div.appendChild(text);
			editor.s.insertNode(div);
			editor.s.setCursorIn(text);

			expect(editor.s.current()).equals(text);
		});

		it('Insert simple text node in editor', () => {
			const editor = getJodit();
			editor.value = '<p>|</p>';
			setCursorToChar(editor);
			editor.s.insertNode(editor.createInside.text('Test'));
			expect(editor.value).equals('<p>Test</p>');
			editor.destruct();
		});

		it('Insert 3 divs', () => {
			const editor = getJodit({
				disablePlugins: 'WrapNodes'
			});

			editor.value = '|';
			setCursorToChar(editor);

			function insert(digit) {
				const div = editor.ed.createElement('div');

				div.innerHTML = digit;
				editor.s.insertNode(div, true, false);
			}

			insert(1);
			insert(2);
			insert(3);

			expect(editor.value).equals('<div>1<div>2<div>3</div></div></div>');
		});

		it('Insert wrong data', function () {
			const editor = getJodit();

			expect(function () {
				editor.s.insertNode();
			}).to.throw(/node must be/);

			expect(function () {
				editor.s.insertNode('Text');
			}).to.throw(/node must be/);

			expect(function () {
				editor.s.insertNode(null);
			}).to.throw(/node must be/);
		});

		it('Select all and delete. Check plugin "backspace"', function () {
			const editor = getJodit();
			editor.value = '<p>asdasd</p><p>asdasd</p><p>asd</p>';
			editor.execCommand('selectall');
			editor.execCommand('delete');
			expect(editor.value).equals('');
		});

		describe('Editor after focus and after blur', function () {
			it('Should change editorIsActive field', function () {
				const input = document.createElement('input'),
					p = document.createElement('p'),
					editor = getJodit();

				editor.s.focus({
					preventScroll: false
				});

				input.type = 'input';
				document.body.appendChild(input);

				p.textContent = 'Hi';
				document.body.appendChild(p);

				editor.value = '<p>Hello world</p>';
				editor.s.focus();
				editor.s.setCursorAfter(editor.editor.firstChild);

				expect(editor.editorIsActive).is.true;

				input.focus();
				simulateEvent('blur', editor.editor);
				expect(editor.editorIsActive).is.false;
				document.body.removeChild(input);

				editor.s.focus();
				simulateEvent('focus', editor.editor);
				editor.s.setCursorAfter(editor.editor.firstChild);
				expect(editor.editorIsActive).is.true;

				const range = editor.s.createRange(true);

				range.selectNodeContents(p);

				simulateEvent('blur', editor.editor);
				expect(editor.editorIsActive).is.false;
				document.body.removeChild(p);
			});
		});

		describe('Cursor position', function () {
			it('Should set cursor after node', function () {
				const editor = getJodit({
					cleanHTML: {
						removeEmptyElements: false
					}
				});

				editor.value = '<p></p>';
				editor.s.setCursorIn(editor.editor.firstChild);

				const spans = [
					editor.ed.createElement('span'),
					editor.ed.createElement('span'),
					editor.ed.createElement('span')
				];

				editor.s.insertNode(spans[0]);
				editor.s.insertNode(spans[1]);
				editor.s.insertNode(spans[2]);

				editor.s.setCursorAfter(spans[1]);
				editor.s.insertNode(editor.ed.createElement('em'));

				expect(editor.value).equals(
					'<p><span></span><span></span><em></em><span></span></p>'
				);
			});

			it('Set cursor in non placed element', function () {
				const editor = getJodit();

				expect(function () {
					const div = editor.ed.createElement('div');
					editor.s.setCursorIn(div);
				}).to.Throw(/in editor/);
			});
		});
	});

	describe('insertHTML', () => {
		it('Insert fragment', function () {
			const editor = getJodit();
			editor.value = '<p>|</p>';
			setCursorToChar(editor);
			editor.s.insertHTML('<div>1</div><div>2</div><div>3</div>');
			expect(editor.value).equals('<div>1</div><div>2</div><div>3</div>');
		});
	});

	describe('insertImage', () => {
		it('Should insert image element', function () {
			const editor = getJodit({
				resizer: {
					forImageChangeAttributes: true
				}
			});
			editor.value = '<p>|</p>';
			setCursorToChar(editor);
			editor.s.insertImage(
				'https://xdsoft.net/jodit/images/artio.jpg',
				{},
				300
			);
			expect(sortAttributes(editor.value)).equals(
				'<p><img src="https://xdsoft.net/jodit/images/artio.jpg" width="300"></p>'
			);
		});

		describe('Disable forImageChangeAttributes', () => {
			it('Should insert image element with style', function () {
				const editor = getJodit({
					resizer: {
						forImageChangeAttributes: false
					}
				});
				editor.value = '<p>|</p>';
				setCursorToChar(editor);
				editor.s.insertImage(
					'https://xdsoft.net/jodit/images/artio.jpg',
					{},
					300
				);
				expect(sortAttributes(editor.value)).equals(
					'<p><img src="https://xdsoft.net/jodit/images/artio.jpg" style="width:300px"></p>'
				);
			});
		});
	});

	describe('wrapInTag', () => {
		// Directly exercises the pure-DOM selection fragmentation that
		// replaced the native `execCommand('fontsize', false, '7')` trick.
		// `<span>` is used as a neutral, easy-to-read wrapper tag.
		[
			{
				name: 'Whole text of a block',
				from: '<p>|test|</p>',
				to: '<p><span>test</span></p>'
			},
			{
				name: 'Middle of a single text node (split at both ends)',
				from: '<p>a|bc|d</p>',
				to: '<p>a<span>bc</span>d</p>'
			},
			{
				name: 'From the start of a text node',
				from: '<p>|ab|cd</p>',
				to: '<p><span>ab</span>cd</p>'
			},
			{
				name: 'To the end of a text node',
				from: '<p>ab|cd|</p>',
				to: '<p>ab<span>cd</span></p>'
			},
			{
				name: 'Partially inside a nested inline element',
				from: '<p>a<strong>b|c|d</strong>e</p>',
				to: '<p>a<strong>b<span>c</span>d</strong>e</p>'
			},
			{
				name: 'Around a whole inline element with text on both sides',
				from: '<p>a|b<strong>cd</strong>e|f</p>',
				to: '<p>a<span>b<strong>cd</strong>e</span>f</p>'
			},
			{
				name: 'Across two sibling inline elements (one run per parent)',
				from: '<p><em>a|b</em><strong>c|d</strong></p>',
				to: '<p><em>a<span>b</span></em><strong><span>c</span>d</strong></p>'
			},
			{
				name: 'Two fully selected blocks (one wrapper per block)',
				from: '<p>|one</p><p>two|</p>',
				to: '<p><span>one</span></p><p><span>two</span></p>'
			},
			{
				name: 'Selection crossing a block boundary',
				from: '<p>on|e</p><p>t|wo</p>',
				to: '<p>on<span>e</span></p><p><span>t</span>wo</p>'
			}
		].forEach(({ name, from, to }) => {
			describe(name, () => {
				it('Should wrap every selected fragment in the tag', () => {
					const editor = getJodit();
					editor.value = from;
					setCursorToChar(editor);

					editor.s.wrapInTag('span');

					expect(sortAttributes(editor.value)).equals(to);
				});
			});
		});

		describe('Callback form', () => {
			it('Should call the callback for every selected fragment', () => {
				const editor = getJodit();
				editor.value = '<p>on|e</p><p>t|wo</p>';
				setCursorToChar(editor);

				const chunks = [];
				editor.s.wrapInTag(font => {
					chunks.push(font.textContent);
				});

				expect(chunks).deep.equals(['e', 't']);
			});
		});

		describe('Return value', () => {
			it('Should return the created wrapper elements', () => {
				const editor = getJodit();
				editor.value = '<p>|one</p><p>two|</p>';
				setCursorToChar(editor);

				const result = editor.s.wrapInTag('span');

				expect(result.length).equals(2);
				expect(result.every(el => el.tagName === 'SPAN')).is.true;
			});
		});
	});
});
