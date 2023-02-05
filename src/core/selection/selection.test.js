/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Selection Module Tests', function () {
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

	describe('Change mode', function () {
		it('Should restore collapsed selection when user change mode - from WYSIWYG to TEXTAREA', function () {
			const editor = getJodit();

			editor.value = '<p>te|st</p>';

			setCursorToChar(editor);

			editor.setMode(Jodit.MODE_SOURCE);

			const mirror = editor.container.querySelector(
				'textarea.jodit-source__mirror'
			);

			expect(mirror.value).equals('<p>test</p>');
			expect(mirror.selectionStart).equals(5);
			expect(mirror.selectionEnd).equals(5);
		});

		it('Should restore collapsed selection when user change mode - from WYSIWYG to TEXTAREA for long string', function (done) {
			unmockPromise();

			let timeout;
			const __done = function () {
				clearTimeout(timeout);
				done();
			};

			timeout = setTimeout(function () {
				expect(false).is.true;
				__done();
			}, 140100);

			Jodit.make(appendTestArea(), {
				defaultMode: Jodit.MODE_SOURCE,
				sourceEditor: 'ace',
				beautifyHTML: false,
				events: {
					sourceEditorReady: function (jodit) {
						jodit.setMode(Jodit.MODE_WYSIWYG);
						jodit.setEditorValue(
							('<p>' + 'test '.repeat(50) + '</p>').repeat(1)
						);

						const sel = jodit.ew.getSelection(),
							range = jodit.ed.createRange();

						range.selectNodeContents(
							jodit.editor.querySelector('p')
						);

						range.collapse(false);
						sel.removeAllRanges();
						sel.addRange(range);

						jodit.s.insertHTML('hello');

						jodit.setMode(Jodit.MODE_SOURCE);

						const ace =
							jodit.__plugins.source.sourceEditor.instance;

						expect(ace).not.null;

						expect(ace.getSelectionRange().start.column).equals(
							258
						);

						expect(ace.getSelectionRange().start.row).equals(0);

						ace.session.insert(ace.getCursorPosition(), ' world');

						expect(
							jodit.__plugins.source.sourceEditor.getValue()
						).equals(
							'<p>' + 'test '.repeat(49) + 'test hello world</p>'
						);

						mockPromise();
						__done();
					}
				}
			});
		}).timeout(116000);

		describe('from TEXTAREA to WYSIWYG', () => {
			it('Should restore collapsed selection when user change mode - from TEXTAREA to WYSIWYG', function () {
				const editor = getJodit({
					useAceEditor: false,
					defaultMode: Jodit.MODE_SOURCE
				});
				editor.value = '<p>test</p>';

				const mirror = editor.container.querySelector(
					'textarea.jodit-source__mirror'
				);
				mirror.setSelectionRange(5, 5);

				editor.setMode(Jodit.MODE_WYSIWYG);
				editor.s.insertNode(editor.createInside.text(' a '));

				expect(editor.value).equals('<p>te a st</p>');
			});

			describe('Inside SCRIPT/STYLE/IFRAME', () => {
				describe('Script', () => {
					it('Should restore selection before these tag', function () {
						const editor = getJodit({
							useAceEditor: false,
							defaultMode: Jodit.MODE_SOURCE
						});
						editor.value = '<p>test</p><script>alert(1)</script>';

						const mirror = editor.container.querySelector(
							'textarea.jodit-source__mirror'
						);
						mirror.setSelectionRange(25, 25);

						editor.setMode(Jodit.MODE_WYSIWYG);
						editor.s.insertNode(editor.createInside.text(' a '));

						expect(editor.value).equals(
							'<p>test a </p><script>alert(1)</script>'
						);
					});
				});

				describe('Style', () => {
					it('Should restore selection before these tag', function () {
						const editor = getJodit({
							useAceEditor: false,
							defaultMode: Jodit.MODE_SOURCE
						});
						editor.value =
							'<p>test</p><style>body {color: red}</style>';

						const mirror = editor.container.querySelector(
							'textarea.jodit-source__mirror'
						);
						mirror.setSelectionRange(25, 25);

						editor.setMode(Jodit.MODE_WYSIWYG);
						editor.s.insertNode(editor.createInside.text(' a '));

						expect(editor.value).equals(
							'<p>test a </p><style>body {color: red}</style>'
						);
					});
				});

				describe('Iframe', () => {
					it('Should restore selection before these tag', function () {
						const editor = getJodit({
							useAceEditor: false,
							defaultMode: Jodit.MODE_SOURCE
						});
						editor.value =
							'<p>test</p><iframe>body {color: red}</iframe>';

						const mirror = editor.container.querySelector(
							'textarea.jodit-source__mirror'
						);
						mirror.setSelectionRange(25, 25);

						editor.setMode(Jodit.MODE_WYSIWYG);
						editor.s.insertNode(editor.createInside.text(' a '));

						expect(editor.value).equals(
							'<p>test a </p><iframe>body {color: red}</iframe>'
						);
					});
				});
			});
		});

		it('Should restore non collapsed selection when user change mode - from WYSIWYG to TEXTAREA', function () {
			const editor = getJodit({
				useAceEditor: false
			});
			editor.value = '<p>test</p>';

			const sel = editor.s.sel,
				range = editor.s.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 1);
			range.setEnd(editor.editor.firstChild.firstChild, 3);
			sel.removeAllRanges();
			sel.addRange(range);

			editor.setMode(Jodit.MODE_SOURCE);

			const mirror = editor.container.querySelector(
				'textarea.jodit-source__mirror'
			);

			expect(mirror.value).equals('<p>test</p>');
			expect(mirror.selectionStart).equals(4);
			expect(mirror.selectionEnd).equals(6);
		});

		describe('Problem', function () {
			it('Should restore non collapsed selection when user change mode - from TEXTAREA to WYSIWYG', function () {
				const editor = getJodit({
					useAceEditor: false,
					defaultMode: Jodit.MODE_SOURCE
				});
				editor.s.focus();
				editor.value = '<p>test</p>';

				const mirror = editor.container.querySelector(
					'textarea.jodit-source__mirror'
				);
				mirror.setSelectionRange(2, 8);

				editor.setMode(Jodit.MODE_WYSIWYG);

				expect(editor.s.isCollapsed()).is.false;

				editor.s.insertNode(editor.createInside.text(' a '));
				expect(editor.value).equals('<p> a </p>');
			});
		});

		it('Should restore collapsed selection inside empty element - from TEXTAREA to WYSIWYG', function () {
			const editor = getJodit({
				useAceEditor: false,
				defaultMode: Jodit.MODE_SOURCE
			});
			editor.value = '<p><a>11</a></p>';

			const mirror = editor.container.querySelector(
				'textarea.jodit-source__mirror'
			);
			mirror.setSelectionRange(7, 7);

			editor.setMode(Jodit.MODE_WYSIWYG);
			expect(editor.s.isCollapsed()).is.true;
			editor.s.insertNode(editor.createInside.text(' a '));
			expect(editor.value).equals('<p><a>1 a 1</a></p>');
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

			const nodesNames = [];

			editor.s.eachSelection(function (node) {
				nodesNames.push(node.nodeName);
			});

			expect(['#text'].toString().toLowerCase()).equals(
				nodesNames.toString().toLowerCase()
			);
		});

		describe('If selected element is UL or LI or content in LI', function () {});
	});

	describe('expandSelection', () => {
		[
			['<p>|test</p>', '<p>|test</p>'],
			['<p>test</p><p>|test|</p>', '<p>test</p>|<p>test</p>|'],
			['<p>|test|</p>', '|<p>test</p>|'],
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
				'|<ul><li><span>test</span>test<s>ss</s></li></ul>|'
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
				'<ul>|<li><span>test</span>test<s>ss</s></li>|<li><span>test</span>test<s>ss</s></li></ul>'
			]
		].forEach(([source, result], i) => {
			describe(`For index ${i}  source: ${source}`, () => {
				it('Should move cursor selection', () => {
					const jodit = getJodit();
					jodit.value = source;
					setCursorToChar(jodit);
					jodit.s.expandSelection();
					replaceCursorToChar(jodit);
					expect(jodit.value).eq(result);
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

		it('Current selection element', function () {
			const editor = getJodit(),
				div = editor.ed.createElement('div'),
				text = editor.createInside.text('jingl');

			editor.value = '';
			div.appendChild(text);
			editor.s.insertNode(div);
			editor.s.setCursorIn(text);

			expect(editor.s.current()).equals(text);
		});

		it('Insert simple text node in editor', function () {
			const area = appendTestArea();
			const editor = new Jodit(area);
			editor.s.insertNode(editor.createInside.text('Test'));
			expect(editor.value).equals('<p>Test</p>');
			editor.destruct();
		});

		it('Insert 3 divs', function () {
			const editor = getJodit();

			function insert(digit) {
				const div = editor.ed.createElement('div');

				div.innerHTML = digit;
				editor.s.insertNode(div);
			}

			insert(1);
			insert(2);
			insert(3);

			expect(editor.value).equals('<div>1</div><div>2</div><div>3</div>');
			editor.destruct();
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

			editor.destruct();
		});

		it('Select all and delete. Check plugin "backspace"', function () {
			const editor = getJodit();
			editor.value = '<p>asdasd</p><p>asdasd</p><p>asd</p>';
			editor.execCommand('selectall');
			editor.execCommand('delete');
			expect(editor.value).equals('');
			editor.destruct();
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
});
